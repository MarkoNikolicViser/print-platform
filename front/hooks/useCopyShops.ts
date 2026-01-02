"use client"

import { useState, useEffect } from "react"
import type { CopyShop } from "../types"
import { strapiService } from "../services/strapiService"

interface UseCopyShopsReturn {
  shops: CopyShop[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  getShopById: (id: string) => CopyShop | undefined
}

export const useCopyShops = (): UseCopyShopsReturn => {
  const [shops, setShops] = useState<CopyShop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShops = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedShops = await strapiService.getCopyShops()
      setShops(fetchedShops)
    } catch (err: any) {
      setError(err.message || "Greška pri učitavanju štamparija")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShops()
  }, [])

  const getShopById = (id: string): CopyShop | undefined => {
    return shops.find((shop) => shop.id === id)
  }

  return {
    shops,
    loading,
    error,
    refetch: fetchShops,
    getShopById,
  }
}
