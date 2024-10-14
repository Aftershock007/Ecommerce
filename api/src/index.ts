import express from "express"
import productRoutes from "./routes/products/index"

const port = 3000
const app = express()

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/products", productRoutes)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
