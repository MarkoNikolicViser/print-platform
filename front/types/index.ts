export interface PrintJob {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  pageCount: number
  printOptions: PrintOptions
  shopId: string
  userId?: string
  status: "pending" | "processing" | "ready" | "completed" | "cancelled"
  totalCost: number
  createdAt: Date
  updatedAt: Date
}

export interface PrintOptions {
  colorPrinting: boolean
  doubleSided: boolean
  paperType: "standard" | "premium" | "photo"
  binding: "none" | "staple" | "spiral" | "hardcover"
  copies: number
}

export interface CopyShop {
  id: string
  name: string
  address: string
  city: string
  phone: string
  email: string
  coordinates: {
    lat: number
    lng: number
  }
  pricing: ShopPricing
  services: string[]
  workingHours: string
  rating: number
  isActive: boolean
}

export interface ShopPricing {
  blackWhite: number // per page
  color: number // per page
  doubleSidedDiscount: number // percentage
  paperTypes: {
    standard: number // multiplier
    premium: number // multiplier
    photo: number // multiplier
  }
  binding: {
    staple: number // fixed cost
    spiral: number // fixed cost
    hardcover: number // fixed cost
  }
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  printHistory: PrintJob[]
  createdAt: Date
}

export interface AddToCartPayload {
  orderCode?: string
  documentS3Key: string
  fileName?: string
  copies: number
  color: "bw" | "color"
  binding: "none" | "spiral" | "stapled"
  pages?: number
  price: number
  customerEmail?: string
  customerPhone?: string
  printShopId: number
}

export interface Order {
  id: string
  order_code: string
  status_code: string
  total_price: number
  order_items: any[]
}
