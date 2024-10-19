import { FlatList } from "react-native"
import products from "../assets/products.json"
import ProductListItem from "@/components/ProductListItem"

interface ProductListItemProps {
  id: number
  description: string
  name: string
  image: string
  price: number
}

export default function HomeScreen() {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
    />
  )
}
