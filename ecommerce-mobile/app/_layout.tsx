import "@/global.css"
import { Link, Stack } from "expo-router"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Icon } from "@/components/ui/icon"
import { ShoppingCart, User } from "lucide-react-native"
import { Pressable } from "react-native"
import { useCart } from "@/store/cartStore"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/store/authStore"

const queryClient = new QueryClient()

export default function RootLayout() {
  const isLoggedIn = useAuth((state) => !!state.token)
  const cartItemsNum = useCart((state) => state.totalQuantity)

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack
          screenOptions={{
            headerRight: () =>
              cartItemsNum > 0 && (
                <Link href="/cart" asChild>
                  <Pressable className="flex-row gap-1 items-center">
                    <Icon as={ShoppingCart} />
                    <Text className="text-lg">{cartItemsNum}</Text>
                  </Pressable>
                </Link>
              )
          }}>
          <Stack.Screen
            name="index"
            options={{
              title: "Shop",
              headerLeft: () =>
                !isLoggedIn && (
                  <Link href="/login" asChild>
                    <Pressable className="flex-row gap-2">
                      <Icon as={User} />
                    </Pressable>
                  </Link>
                )
            }}
          />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  )
}
