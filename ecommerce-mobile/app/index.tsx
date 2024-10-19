import { ActivityIndicator, FlatList } from "react-native"
import ProductListItem from "../components/ProductListItem"
import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value"
import { getProducts } from "@/api/products"
import { useQuery } from "@tanstack/react-query"
import { Text } from "@/components/ui/text"

export default function HomeScreen() {
  const {
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  })

  const numColumns = useBreakpointValue({
    default: 2,
    xs: 1,
    sm: 3,
    md: 4,
    xl: 4
  })

  if (isLoading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <Text>Error fetching products</Text>
  }

  return (
    <FlatList
      key={numColumns}
      data={product}
      numColumns={numColumns}
      contentContainerClassName="gap-2 max-w-[960px] mx-auto w-full"
      columnWrapperClassName="gap-2"
      renderItem={({ item }) => <ProductListItem product={item} />}
    />
  )
}
