import { Request, Response } from "express"
import { responseWrapper } from "../../util/responseWrapper.js"
import { db } from "../../db/index.js"
import { orderItemsTable, ordersTable } from "../../db/ordersSchema.js"
import { eq } from "drizzle-orm"
import { productsTable } from "../../db/productsSchema.js"
import logger from "../../logger.js"

export async function createOrder(req: Request, res: Response) {
  try {
    const { _, items } = req.cleanBody
    const userId = req.userId
    if (!userId) {
      responseWrapper(res, false, 400, "Invalid order data")
    }
    const [newOrder] = await db
      .insert(ordersTable)
      .values({ userId: Number(userId) })
      .returning()
    const orderItems = items.map((item: any) => ({
      ...item,
      orderId: newOrder.id
    }))
    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning()
    for (const oitem of newOrderItems) {
      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, oitem.productId))
      if (
        oitem.price <= 0 ||
        oitem.price !== product.price ||
        oitem.quantity <= 0
      ) {
        return responseWrapper(res, false, 400, "Invalid order data")
      }
      if (oitem.quantity > product.quantity) {
        return responseWrapper(
          res,
          false,
          400,
          "Insufficient product quantity available"
        )
      }
      const updatedQuantity = product.quantity - oitem.quantity
      const [updatedProduct] = await db
        .update(productsTable)
        .set({
          quantity: updatedQuantity
        })
        .where(eq(productsTable.id, oitem.productId))
        .returning()
      if (!updatedProduct) {
        return responseWrapper(res, false, 400, "Invalid order data")
      }
    }
    responseWrapper(res, true, 201, "Order created successfully", {
      ...newOrder,
      items: newOrderItems
    })
  } catch (error) {
    logger.info("Error creating order", error)
    responseWrapper(res, false, 500, "Error creating order")
  }
}

export async function listOrders(req: Request, res: Response) {
  try {
    // TODO: if req.role is admin return all orders, else if req.role is seller return orders by sellerId, else return only orders filtered by req.userId
    const orders = await db.select().from(ordersTable)
    responseWrapper(res, true, 200, "Orders fetched successfully", orders)
  } catch (error) {
    logger.info("Error fetching orders", error)
    responseWrapper(res, false, 500, "Error fetching orders")
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    // TODO: required to setup the relationship
    // const mergedOrder = await db.query.ordersTable.findFirst({
    //   where: eq(ordersTable.id, id),
    //   with: {
    //     items: true,
    //   },
    // });
    const orderWithItems = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
    if (!orderWithItems.length) {
      return responseWrapper(res, false, 404, "Order not found")
    }
    const mergedOrder = {
      ...orderWithItems[0].orders,
      items: orderWithItems.map((oitem) => oitem.order_items)
    }
    responseWrapper(res, true, 200, "Order fetched successfully", mergedOrder)
  } catch (error) {
    logger.info("Error fetching order", error)
    responseWrapper(res, false, 500, "Error fetching order")
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    const [updatedOrder] = await db
      .update(ordersTable)
      .set(req.body)
      .where(eq(ordersTable.id, id))
      .returning()
    if (!updatedOrder) {
      return responseWrapper(res, false, 404, "Order not found")
    } else {
      responseWrapper(
        res,
        true,
        200,
        "Order updated successfully",
        updatedOrder
      )
    }
  } catch (error) {
    logger.info("Error updating order", error)
    responseWrapper(res, false, 500, "Error updating order")
  }
}
