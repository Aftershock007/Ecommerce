import { Card } from "@/components/ui/card"
import { Image } from "@/components/ui/image"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Pressable } from "react-native"
import { Link } from "expo-router"

export default function ProductListItem({ product }) {
  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable className="flex-1">
        <Card className="p-4 rounded-lg flex-1">
          <Image
            source={{
              uri: product.image
            }}
            className="mb-5 h-[200px] w-full rounded-md"
            alt={`${product.name} image`}
            resizeMode="contain"
          />
          <Text
            className="text-sm font-normal mb-2 text-typography-700"
            numberOfLines={1}>
            {product.name}
          </Text>
          <Heading size="md" className="mb-2">
            ${product.price}
          </Heading>
        </Card>
      </Pressable>
    </Link>
  )
}
