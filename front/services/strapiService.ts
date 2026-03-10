import axios, { AxiosInstance } from 'axios';
import type {
  CopyShop,
  User,
  AddToCartPayload,
  SyncCartPayload,
  Order,
  OrderItemsResponse,
  PrintOptions,
  MarkPaidPayload,
} from '../types';
import { API_URL } from '../helpers/constants';

class StrapiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      // IMPORTANT:
      // API_URL should now be "/strapi" (via constants.ts),
      // because Next rewrites /strapi/* -> https://...strapiapp.com/api/*
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
  }

  /* -------------------- AUTH -------------------- */

  async loginUser(identifier: string, password: string): Promise<{ user: User }> {
    const res = await this.api.post('/auth/local-cookie', { identifier, password });
    return { user: res.data.user };
  }

  async register(username: string, email: string, password: string, app_role: string): Promise<{ user: User }> {
    const res = await this.api.post('/auth/register-cookie', {
      username,
      email,
      password,
      app_role
    });
    return { user: res.data.user };
  }

  async getMe(): Promise<User | null> {
    try {
      const res = await this.api.get('/users/me');
      return res.data;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  /* -------------------- COPY SHOPS -------------------- */

  async getCopyShops(
    productTemplateId?: number,
    documents?: { pages?: number; name?: string; url?: string; mime?: string }[],
    quantity?: number,
    selectedOptions?: PrintOptions | string,
  ): Promise<CopyShop[]> {
    const params: Record<string, any> = {};

    if (productTemplateId !== undefined) params.productTemplateId = productTemplateId;
    if (documents !== undefined) params.documents = JSON.stringify(documents);
    if (quantity !== undefined) params.quantity = quantity;
    if (selectedOptions !== undefined) params.selectedOptions = selectedOptions;

    const res = await this.api.get('/print-shops', { params });
    return res.data;
  }

  /* -------------------- CART / ORDER -------------------- */

  async addToCart(payload: AddToCartPayload): Promise<Order | null> {
    try {
      const res = await this.api.post('/orders/add-to-cart', payload);
      return res.data;
    } catch {
      return null;
    }
  }

  async markOrderPaid(payload: MarkPaidPayload): Promise<boolean> {
    try {
      await this.api.post('/checkout/success', payload);
      return true;
    } catch {
      return false;
    }
  }

  async syncCart(payload: SyncCartPayload): Promise<Order> {
    const res = await this.api.put('/order/sync', payload);
    return res.data;
  }

  async getProductTemplatesByMime(documentMimes: string[]) {
    try {
      const res = await this.api.get('/product-templates/by-mime', {
        params: { document_mime: documentMimes }, // niz MIME tipova
        paramsSerializer: (params) =>
          Object.entries(params)
            .map(([key, val]) =>
              Array.isArray(val)
                ? val.map((v) => `${key}=${encodeURIComponent(v)}`).join('&')
                : `${key}=${encodeURIComponent(val as string)}`
            )
            .join('&'),
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching product templates by mime:', error);
      return [];
    }
  }

  async getCartItemCount(orderId: string) {
    try {
      const res = await this.api.get(`/orders/${orderId}/items/count`);
      return res.data;
    } catch {
      return { orderId, count: 0 };
    }
  }

  async getOrderItems(orderId: string): Promise<OrderItemsResponse> {
    const res = await this.api.get(`/order/${orderId}/items`);
    return res.data;
  }

  /* -------------------- PRINT SHOP (ADMIN) -------------------- */

  async getMyPrintShop(): Promise<CopyShop> {
    const res = await this.api.get('/print-shop/me');
    return res.data;
  }

  async getProductTemplates() {
    try {
      const res = await this.api.get('/product-templates');
      return res.data;
    } catch (error) {
      console.error('Error fetching product templates:', error);
      return [];
    }
  }

  async getMyShopOrders() {
    try {
      const res = await this.api.get('/orders/my-shop');
      return res.data;
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  async updateMyPrintShop(
    data: Partial<Pick<CopyShop, 'name' | 'address' | 'city' | 'phone' | 'working_hours' | 'latitude' | 'longitude'>>,
  ): Promise<CopyShop> {
    const res = await this.api.put('/print-shop/me', data);
    return res.data;
  }

  async createMyPrintShop(
    data: Partial<Pick<CopyShop, 'name' | 'address' | 'city' | 'phone' | 'working_hours' | 'latitude' | 'longitude'>>,
  ): Promise<CopyShop> {
    const res = await this.api.post('/print-shop/create', data);
    return res.data;
  }

  async upsertProductPricing(payload: {
    product_template: number;
    base_price: number;
    option_price_modifiers: any;
    is_active?: boolean;
  }) {
    const res = await this.api.post('/pricing/upsert', payload);
    return res.data;
  }
}

export const strapiService = new StrapiService();
