import { Request, Response } from "express"
import { responseWrapper } from "../../util/responseWrapper.js"
import { db } from "../../db/index.js"
import { orderItemsTable, ordersTable } from "../../db/ordersSchema.js"

export async function createOrder(req: Request, res: Response) {
  try {
    const { order, items } = req.cleanBody
    const userId = req.userId
    if (!userId) {
      responseWrapper(res, false, 400, "Invalid order data")
    }
    const [newOrder] = await db
      .insert(ordersTable)
      .values({ userId: Number(userId) })
      .returning()
    // TODO: validate products ids and take their actual price from db
    const orderItems = items.map((item: any) => ({
      ...item,
      orderId: newOrder.id
    }))
    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning()
    res.status(201).json({ ...newOrder, items: newOrderItems })
  } catch (error) {
    responseWrapper(res, false, 500, "Error fetching orders")
  }
}
