import { Response } from "express"

type ApiResponse = {
  success: boolean
  message?: string
  data?: any
}

export function responseWrapper(
  res: Response,
  success: boolean,
  statusCode: number,
  message?: string,
  data?: any
) {
  const response: ApiResponse = {
    success,
    message,
    data
  }
  res.status(statusCode).json(response)
}
