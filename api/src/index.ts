import express, { json, urlencoded } from "express"
import productRoutes from "./routes/products/index.js"
import authRoutes from "./routes/auth/index.js"
import serverless from "serverless-http"

const port = 3000
const app = express()

// middlewares: we can take json and urlencoded data by this
app.use(json())
app.use(urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/products", productRoutes)
app.use("/auth", authRoutes)

if (process.env.NODE_ENV === "development") {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
}

export const handler = serverless(app)
