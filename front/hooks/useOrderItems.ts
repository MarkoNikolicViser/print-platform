import { useQuery } from "@tanstack/react-query"
import { strapiService } from "../services/strapiService"

export function useOrderItems(
    orderId?: string,
    enabled: boolean = true
) {
    return useQuery<{ orderId: string, count: number }>({
        queryKey: ["order-items", orderId],
        queryFn: () => {
            if (!orderId) {
                throw new Error("orderId is required")
            }

            return strapiService.getOrderItems(orderId)
        },
        enabled: enabled && !!orderId,
        staleTime: 60 * 1000, // 1 min (može i kraće)
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    })
}
