import { Text } from "react-native"

export default function ProductListItem({ product }: any) {
  return <Text style={{ fontSize: 20 }}>{product.name}</Text>
}
