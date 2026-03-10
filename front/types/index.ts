export interface PrintJob {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  pageCount: number;
  printOptions: PrintOptions;
  shopId: string;
  userId?: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiShop {
  id: number;
  name: string;
  address: string;
  city: string;
  templates: string[];
  is_open_today: boolean;
  working_time_today: string | null;
  total_price?: number;
}

export interface PrintOptions {
  colorPrinting: boolean;
  doubleSided: boolean;
  paperType: 'standard' | 'premium' | 'photo';
  binding: 'none' | 'staple' | 'spiral' | 'hardcover';
  copies: number;
}

export interface CopyShop {
  id: number;
  name: string;
  address: string;
  city: string;
  phone?: string;
  working_hours?: string;
  latitude?: number | null;
  longitude?: number | null;
  templates: string[];
  is_open_now: boolean;
  working_time_today: string | null;
  is_open_today: boolean;
  total_price?: number;
  is_active?: boolean;
}

export interface ShopPricing {
  blackWhite: number; // per page
  color: number; // per page
  doubleSidedDiscount: number; // percentage
  paperTypes: {
    standard: number; // multiplier
    premium: number; // multiplier
    photo: number; // multiplier
  };
  binding: {
    staple: number; // fixed cost
    spiral: number; // fixed cost
    hardcover: number; // fixed cost
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  printHistory: PrintJob[];
  createdAt: Date;
  app_role: string;
  username: string;
  avatarUrl?: string;
}

export interface CartDocument {
  url?: string;
  name: string;
  pages: number;
  mime?: string;
}

export interface AddToCartPayload {
  order_code?: string;
  product_template_id?: number;
  selected_options: string;
  quantity: number;
  print_shop_id: number | null;
  customer_email?: string;
  documents: CartDocument[];
}

export interface Order {
  orderId: string;
  order_code: string;
  status_code: string;
  total_price: number;
  order_items: OrderItem[];
  count: number;
  total?: number;
  expiresAt: string;
  items: ProductTemplate[];
}

export interface OrderItemsResponse {
  order_code?: string;
  total: number;
  items: OrderItem[];
}
export type IconKey =
  | 'description'
  | 'aspect_ratio'
  | 'checkroom'
  | 'local_cafe'
  | 'image'
  | 'wallpaper';

export interface ProductTemplate {
  id: number;
  name: string;
  description: string;
  icon: IconKey;
  allowed_options?: Record<string, AllowedOption>;
  pricing?: {
    is_active: boolean;
    [key: string]: string | number | boolean | null | undefined;
  };
  supported_mime: string | string[];
  is_disabled: boolean;
}

export type SelectedOptions = {
  paper_size?: string;
  color?: string;
  binding?: string;
  doubleSided?: boolean;
  copies?: number;
  [k: string]: string | number | boolean | null | undefined;
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
  document_url?: string;
  document_pages: number;
  document_mime: string;
  unit_price: number | string;
  total_price: number | string;
  quantity: number;
  product_template: {
    id?: number;
    name?: string;
    description?: string;
  };
  selected_options: SelectedOptions;
  allowed_options: Record<string, AllowedOption>;
  status_code: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
};
export interface SyncCartPayload {
  order_code: string | undefined;
  updated?: Array<{
    id: number;
    selected_options?: Record<string, string | number | boolean | null | undefined>;
    quantity?: number;
  }>;
  created?: Array<{
    file_id?: number;
    product_template?: number;
    selected_options?: Record<string, string | number | boolean | null | undefined>;
    quantity?: number;
  }>;
  deletedIds?: number[];
}

export type ApiError = {
  status: number;
  message: string;
};
export interface FileInfo {
  name: string;
  size: number;
  type: PrintType | string;
  pages?: number;
  url?: string;
}
export type PrintType = 'application/pdf' | 'image/jpeg' | 'mug' | 'tshirt' | 'image/png';

export interface PreviewProps {
  fileUrl: string;
  fileType?: string;
}
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, app_role: string) => Promise<void>;
  logout: (route?: string) => void;
  refreshUser: () => void;
}

export type MarkPaidPayload = {
  order_code: string;
  customer_email?: string;
  provider: 'PayPal' | 'Stripe';
  provider_payment_id: string;
  amount: number;
  fee?: number;
};