const API_URL = process.env.EXPO_PUBLIC_API_URL

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  const productData = await res.json()
  if (!res.ok) {
    throw new Error("Error fetching products")
  }
  return productData.data
}

export async function getProductById(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`)
  const productData = await res.json()
  if (!res.ok) {
    throw new Error("Error fetching product")
  }
  return productData.data
}