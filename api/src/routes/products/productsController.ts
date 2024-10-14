import { Request, Response } from "express"
import { db } from "../../db/index.js"
import { productsTable } from "../../db/productsSchema.js"
import { eq } from "drizzle-orm"
import { responseWrapper } from "../../util/responseWrapper.js"

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable)
    responseWrapper(res, true, 200, "Products fetched successfully", products)
  } catch (error) {
    responseWrapper(res, false, 500, "Error fetching products")
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
    if (product) {
      responseWrapper(
        res,
        true,
        200,
        "Product fetched successfully by id",
        product
      )
    } else {
      responseWrapper(res, false, 404, "Product not found")
    }
  } catch (error) {
    responseWrapper(res, false, 500, "Error fetching a product by id")
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const [product] = await db
      .insert(productsTable)
      .values(req.cleanBody)
      .returning()
    responseWrapper(res, true, 201, "Product created successfully", product)
  } catch (error) {
    responseWrapper(res, false, 500, "Error creating product")
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const [updatedProduct] = await db
      .update(productsTable)
      .set(req.cleanBody)
      .where(eq(productsTable.id, id))
      .returning()
    if (updatedProduct) {
      responseWrapper(
        res,
        true,
        200,
        "Product updated successfully",
        updatedProduct
      )
    } else {
      responseWrapper(res, false, 404, "Product not found")
    }
  } catch (error) {
    responseWrapper(res, false, 500, "Error updating product")
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning()
    if (deletedProduct) {
      responseWrapper(res, true, 204)
    } else {
      responseWrapper(res, false, 404, "Product not found")
    }
  } catch (error) {
    responseWrapper(res, false, 500, "Error deleting product")
  }
}
