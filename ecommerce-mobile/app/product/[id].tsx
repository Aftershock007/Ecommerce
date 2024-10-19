import { Text } from "@/components/ui/text"
import { Stack, useLocalSearchParams } from "expo-router"
import { Card } from "@/components/ui/card"
import { Image } from "@/components/ui/image"
import { Heading } from "@/components/ui/heading"
import { VStack } from "@/components/ui/vstack"
import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { getProductById } from "@/api/products"
import { ActivityIndicator } from "react-native"
import { useCart } from "@/store/cartStore"
import { HStack } from "@/components/ui/hstack"

export default function details() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const addProduct = useCart((state) => state.addProducts)
  const items = useCart((state) => state.items)

  const {
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(Number(id))
  })
  const cartItem = useCart
    .getState()
    .items.find((item) => item.product.id === product?.id)
  const cartQuantity = cartItem ? cartItem.quantity : 0
  const isOutOfStock =
    product?.quantity === 0 || cartQuantity >= product?.quantity
  async function addToCart() {
    if (!isOutOfStock) {
      await addProduct(product, 1)
    } else {
      console.log("Cannot add more items than available stock")
    }
  }
  async function removeFromCart() {
    if (cartQuantity > 0) {
      await addProduct(product, -1)
    }
  }
  if (isLoading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <Text>Product not found </Text>
  }

  return (
    <Box className="flex-1 items-center p-3">
      <Stack.Screen options={{ title: product.name }} />
      <Card className="p-5 rounded-lg max-w-[960px] w-full flex-1">
        <Image
          source={{
            uri: product.image
          }}
          className="mb-6 h-[300px] w-full rounded-md"
          alt={`${product.name} image`}
          resizeMode="contain"
        />
        <Text className="text-sm font-normal text-typography-700">
          {product.name}
        </Text>
        <VStack className="mb-6">
          <HStack className="justify-between items-center">
            <Heading size="md" className="mb-3">
              ${product.price}
            </Heading>
            <Heading
              size="md"
              className="mb-3 border-2 border-outline-200 px-2 rounded-xl">
              {product.quantity}
            </Heading>
          </HStack>
          <Text size="sm">{product.description}</Text>
        </VStack>
        <Box className="flex-col sm:flex-row">
          <Button
            onPress={addToCart}
            className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1"
            disabled={isOutOfStock}
            style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
            <ButtonText size="sm">
              {isOutOfStock ? "Out of stock" : "Add to cart"}
            </ButtonText>
          </Button>
          <Button
            action="negative"
            onPress={removeFromCart}
            disabled={cartQuantity === 0}
            style={{ opacity: cartQuantity === 0 ? 0.5 : 1 }}
            className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1">
            <ButtonText size="sm">Remove</ButtonText>
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
