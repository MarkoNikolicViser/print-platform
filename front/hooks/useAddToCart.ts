import { useMutation } from "@tanstack/react-query"
import { strapiService } from "../services/strapiService"
import type { AddToCartPayload, Order } from "../types"

export function useAddToCart() {
    return useMutation({
        mutationFn: async (payload: AddToCartPayload): Promise<Order> => {
            const order = await strapiService.addToCart(payload)
            if (!order) {
                throw new Error("Failed to add item to cart")
            }
            return order
        },

        onSuccess: (order) => {
            // Persist order_code for next add-to-cart calls
            localStorage.setItem("order_code", order.order_code)
        },

        onError: (error) => {
            console.error("Add to cart failed:", error)
        },
    })
}
