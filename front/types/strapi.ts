export type StrapiID = number;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

export interface StrapiEntity<T> {
  id: StrapiID;
  attributes: T;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination?: StrapiPagination;
  [key: string]: JsonValue | StrapiPagination | undefined;
}

export interface StrapiListResponse<T> {
  data: StrapiEntity<T>[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T> | null;
  meta: StrapiMeta;
}

export interface StrapiErrorPayload {
  status: number;
  name: string;
  message: string;
  details?: JsonObject;
}

export interface StrapiErrorResponse {
  data: null;
  error: StrapiErrorPayload;
}

export type ProductTemplateOption =
  | {
      pricing_type: 'enum';
      component_type: 'select' | 'radio';
      label?: string;
      options: { value: string; label?: string }[];
    }
  | {
      pricing_type: 'boolean';
      component_type: 'checkbox';
      label?: string;
    }
  | {
      pricing_type: 'number';
      component_type: 'number';
      label?: string;
      min?: number;
      max?: number;
    }
  | {
      pricing_type: 'per_page' | 'range';
      component_type: 'hidden';
      label?: string;
    };

export interface ProductTemplateAttributes {
  name: string;
  description?: string;
  icon: string;
  supported_mime: string;
  allowed_options: Record<string, ProductTemplateOption>;
}

export interface PrintShopAttributes {
  name: string;
  address: string;
  city: string;
  email: string;
  is_active: boolean;
}

export interface OrderItemAttributes {
  document_name: string;
  document_url: string;
  document_mime?: string;
  document_pages?: number;
  quantity: number;
  selected_options: Record<string, JsonValue>;
  status_code: 'pending' | 'printing' | 'ready' | 'cancelled';
  unit_price: number | string;
  total_price: number | string;
}

export interface OrderAttributes {
  order_code: string;
  status_code:
    | 'draft'
    | 'uploaded'
    | 'paid'
    | 'printing'
    | 'ready'
    | 'picked_up'
    | 'cancelled'
    | 'expired';
  total_price: number | string;
  customer_email?: string;
  expires_at?: string;
}
