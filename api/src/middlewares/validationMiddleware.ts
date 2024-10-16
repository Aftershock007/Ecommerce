import { Request, Response, NextFunction } from "express"
import { responseWrapper } from "../util/responseWrapper.js"
import { ZodError, ZodObject, ZodRawShape } from "zod"
import _ from "lodash"

export function validateData<T extends ZodRawShape>(schema: ZodObject<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      req.cleanBody = _.pick(req.body, Object.keys(schema.shape))
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message
        }))
        responseWrapper(res, false, 400, "Invalid data", errorMessages)
      } else {
        responseWrapper(res, false, 500, "Internal server error")
      }
    }
  }
}
