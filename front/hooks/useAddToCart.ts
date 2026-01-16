import { useMutation, useQueryClient } from "@tanstack/react-query"
import { strapiService } from "../services/strapiService"
import type { AddToCartPayload, Order } from "../types"

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: AddToCartPayload): Promise<string> => {
            const order = await strapiService.addToCart(payload)
            if (!order) {
                throw new Error("Failed to add item to cart")
            }
            return order
        },

        onSuccess: ({ order_code, cart_count }) => {
            localStorage.setItem("order_code", order_code)

            queryClient.setQueryData(
                ["cart-item-count", order_code],
                {
                    orderId: order_code,
                    count: cart_count,
                }
            )
        },

        onError: (error) => {
            console.error("Add to cart failed:", error)
        },
    })
}
