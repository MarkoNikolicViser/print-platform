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
  id: number
  name: string
  address: string
  city: string

  // UI koristi ovo
  templates: string[]

  is_open_now: boolean
  working_time_today: string | null

  total_price?: number
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
  order_code?: string
  product_template_id?: number
  selected_options: string
  quantity: number
  print_shop_id: number | null
  customer_email: string
  document_url: string
  document_name: string
  document_pages: string
  document_mime?: string
}

export interface Order {
  id: string
  order_code: string
  status_code: string
  total_price: number
  order_items: any[]
}
export interface ProductTemplate {
  id: number;
  name: string;
  description: string;
  icon: string;
  allowed_options?: any
}
type AllowedOptionType = 'select' | 'radio' | 'number';

interface AllowedOptionBase {
  type: AllowedOptionType;
  label: string;
  pricing_type: 'enum' | 'boolean' | 'number' | 'range';
  required?: boolean;
  default?: any;
}

interface AllowedOptionSelect extends AllowedOptionBase {
  type: 'select' | 'radio';
  options: { value: any; label: string }[];
}

interface AllowedOptionNumber extends AllowedOptionBase {
  type: 'number';
  min?: number;
  max?: number;
}


export type SelectedOptions = {
  paper_size?: string;
  color?: string;
  binding?: string;
  doubleSided?: boolean;
  copies?: number;
  // add any other option keys here
  [k: string]: any;
};

export type AllowedOption = {
  type: 'select' | 'radio' | 'number';
  label: string;
  options?: { label: string; value: string | number | boolean }[];
  min?: number;
  max?: number;
};

export type OrderItem = {
  id: number;
  documentId: string;
  document_name: string;
  document_pages: number;
  document_mime: string;
  unit_price: number | string;
  total_price: number | string;
  quantity: number;
  selected_options: SelectedOptions;
  allowed_options: Record<string, AllowedOption>;
  status_code: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
};
