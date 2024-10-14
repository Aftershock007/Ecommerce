import { NextFunction, Request, Response } from "express"
import { responseWrapper } from "../util/responseWrapper.js"
import jwt from "jsonwebtoken"

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")
  if (!token) {
    return responseWrapper(res, false, 401, "Access denied")
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    if (typeof decoded !== "object" || !decoded?.userId) {
      return responseWrapper(res, false, 401, "Access denied")
    }
    req.userId = decoded.userId
    req.role = decoded.role
    next()
  } catch (error) {
    responseWrapper(res, false, 401, "Access denied")
  }
}

export function verifySeller(req: Request, res: Response, next: NextFunction) {
  const role = req.role
  if (role !== "seller") {
    return responseWrapper(res, false, 401, "Access denied")
  }
  next()
}
