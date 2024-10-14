import express, { json, urlencoded } from "express"
import authRoutes from "./routes/auth/index.js"
import productsRoutes from "./routes/products/index.js"
import ordersRoutes from "./routes/orders/index.js"
import serverless from "serverless-http"

const port = 3000
const app = express()

// middlewares: we can take json and urlencoded data by this
app.use(json())
app.use(urlencoded({ extended: false }))

app.get("/", (_, res) => {
  res.send("Hello World!")
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
