import { Router } from "express"
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct
} from "./productController"
import { validateData } from "../../middlewares/validationMiddleware"
import {
  createProductSchema,
  updateProductSchema
} from "../../db/productsSchema"

const router = Router()

// products endpoints
router.get("/", listProducts)
router.get("/:id", getProductById)
router.post("/", validateData(createProductSchema), createProduct)
router.put("/:id", validateData(updateProductSchema), updateProduct)
router.delete("/:id", deleteProduct)

export default router
