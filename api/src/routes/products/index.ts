import { Router } from "express"

const router = Router()

// products endpoints
router.get("/", (req, res) => {
  res.send("GET Products")
})

router.get("/:id", (req, res) => {
  res.send("GET One Product")
})

router.post("/", (req, res) => {
  res.send("POST Products")
})

export default router
