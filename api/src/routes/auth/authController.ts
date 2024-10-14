import { Request, Response } from "express"
import { usersTable } from "../../db/usersSchema.js"
import { responseWrapper } from "../../util/responseWrapper.js"
import { db } from "../../db/index.js"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function registerUser(req: Request, res: Response) {
  try {
    const data = req.cleanBody
    data.password = await bcrypt.hash(data.password, 10)
    const [user] = await db.insert(usersTable).values(data).returning()
    const { password: _, ...userWithoutPassword } = user
    responseWrapper(
      res,
      true,
      201,
      "User created successfully",
      userWithoutPassword
    )
  } catch (error) {
    responseWrapper(res, false, 500, "Error creating user")
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.cleanBody
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return responseWrapper(res, false, 401, "Authentication failed")
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "30d"
      }
    )
    const { password: _, ...userWithoutPassword } = user
    res.status(200).json({
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    responseWrapper(res, false, 500, "Error logging in user")
  }
}
