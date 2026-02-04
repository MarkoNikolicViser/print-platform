import axios, { AxiosInstance } from 'axios';
import type {
  CopyShop,
  User,
  AddToCartPayload,
  SyncCartPayload,
  Order,
  PrintOptions,
} from '../types';
import { API_URL } from '../helpers/constants';

class StrapiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
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

  async register(username: string, email: string, password: string): Promise<{ user: User }> {
    const res = await this.api.post('/auth/register-cookie', {
      username,
      email,
      password,
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
    numberOfPages?: number,
    quantity?: number,
    selectedOptions?: PrintOptions | string
  ): Promise<CopyShop[]> {
    const params: Record<string, any> = {};
    if (productTemplateId !== undefined) params.productTemplateId = productTemplateId;
    if (numberOfPages !== undefined) params.numberOfPages = numberOfPages;
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

  async syncCart(payload: SyncCartPayload): Promise<Order> {
    const res = await this.api.put('/order/sync', payload);
    return res.data;
  }

  async getProductTemplatesByMime(documentMime: string) {
    try {
      const res = await this.api.get('/product-templates/by-mime', { params: { document_mime: documentMime } });
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

  async getOrderItems(orderId: string) {
    const res = await this.api.get(`/order/${orderId}/items`);
    return res.data;
  }

  /* -------------------- PRINT SHOP (ADMIN) -------------------- */

  async getMyPrintShop(): Promise<CopyShop> {
    const res = await this.api.get('/print-shop/me');
    return res.data;
  }

  async updateMyPrintShop(
    data: Partial<Pick<CopyShop, 'name' | 'address' | 'city' | 'phone' | 'working_hours'>>
  ): Promise<CopyShop> {
    const res = await this.api.put('/print-shop/me', data);
    return res.data;
  }
}

export const strapiService = new StrapiService();