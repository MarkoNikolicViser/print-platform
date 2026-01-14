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

        onSuccess: (order) => {
            queryClient.invalidateQueries({ queryKey: ["cart-item-count"] })
            localStorage.setItem("order_code", order)
        },

        onError: (error) => {
            console.error("Add to cart failed:", error)
        },
    })
}
