import express, { json, urlencoded } from "express"
import authRoutes from "./routes/auth/index.js"
import productsRoutes from "./routes/products/index.js"
import ordersRoutes from "./routes/orders/index.js"
import serverless from "serverless-http"
import logger from "./logger.js"
import morgan from "morgan"

const port = 3000
const app = express()
const morganFormat = ":method :url :status :response-time ms"

app.use(json())
app.use(urlencoded({ extended: false }))
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: any) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3]
        }
        logger.info(JSON.stringify(logObject))
      }
    }
  })
)

app.get("/", (_, res) => {
  res.send("Welcome to the Ecommerce APIs")
})

app.use("/auth", authRoutes)
app.use("/products", productsRoutes)
app.use("/orders", ordersRoutes)

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
}

export const handler = serverless(app)
