import { Router } from "express"
import { registerUser, loginUser } from "./authController.js"
import { validateData } from "../../middlewares/validationMiddleware.js"
import { createUserSchema, loginUserSchema } from "../../db/usersSchema.js"

const router = Router()

router.post("/register", validateData(createUserSchema), registerUser)
router.post("/login", validateData(loginUserSchema), loginUser)

export default router
