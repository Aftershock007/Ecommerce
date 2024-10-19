import { createOrder } from "@/api/orders"
import { getProductById } from "@/api/products"
import { Button, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useCart } from "@/store/cartStore"
import { useMutation } from "@tanstack/react-query"
import { Redirect } from "expo-router"
import { ActivityIndicator, FlatList } from "react-native"

export default function CartScreen() {
  const items = useCart((state) => state.items)
  const resetCart = useCart((state) => state.resetCart)

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      try {
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.product.id)
            return {
              productId: item.product.id,
              quantity: item.quantity,
              price: product.price
            }
          })
        )
        return createOrder(updatedItems)
      } catch (error) {
        console.log(error)
        throw new Error("Failed to create order")
      }
    },
    onSuccess: () => {
      console.log("Order successful")
      resetCart()
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const onCheckout = async () => {
    createOrderMutation.mutate()
  }
  if (items.length === 0) {
    return <Redirect href="/" />
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.product.id.toString()}
      contentContainerClassName="gap-2 max-w-[960px] w-full mx-auto p-2"
      renderItem={({ item }) =>
        item.quantity > 0 ?
          <HStack className="bg-white p-3 items-center">
            <VStack space="sm">
              <Text bold>{item.product.name}</Text>
              <Text>$ {item.product.price}</Text>
            </VStack>
            <Text className="ml-auto border-2 border-outline-200 px-2 rounded-xl font-bold">
              {item.quantity}
            </Text>
          </HStack>
        : null
      }
      ListFooterComponent={() => (
        <Button
          onPress={onCheckout}
          disabled={createOrderMutation.status === "pending"}>
          {createOrderMutation.status === "pending" ?
            <ActivityIndicator size="small" color="#fff" />
          : <ButtonText>Checkout</ButtonText>}
        </Button>
      )}
    />
  )
}
