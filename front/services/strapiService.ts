import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  CopyShop,
  User,
  AddToCartPayload,
  SyncCartPayload,
  Order,
  PrintOptions,
} from '../types';
import { API_URL, TOKEN_KEY } from '../helpers/constants'

function getJwtFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(^| )jwtToken=([^;]+)/);
  return match ? match[2] : null;
}

class StrapiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // bitno za SSO / cookies
    });

    // ⬇️ init auth token (localStorage OR cookie)
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem(TOKEN_KEY) || getJwtFromCookie();

      if (token) {
        this.setAuthToken(token);
      }
    }

    // ⛔ global 401 handler
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('401 detected – user not authenticated');
          // ❌ NE logout ovde
          // logout radiš samo na eksplicitni klik
        }
        return Promise.reject(error);
      },
    );

  }

  /* -------------------- AUTH HELPERS -------------------- */

  private setAuthToken(token: string) {
    this.api.defaults.headers.common.Authorization = `Bearer ${token}`;

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      document.cookie = `jwtToken=${token}; path=/; SameSite=Lax`;
    }
  }

  private removeAuthToken() {
    delete this.api.defaults.headers.common.Authorization;

    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      document.cookie = 'jwtToken=; path=/; max-age=0';
    }
  }

  /* -------------------- AUTH -------------------- */

  async loginUser(
    identifier: string,
    password: string,
  ): Promise<{ jwt: string; user: User }> {
    const response: AxiosResponse = await axios.post(
      `${API_URL}/auth/local`,
      { identifier, password },
      { headers: { 'Content-Type': 'application/json' } },
    );

    const { jwt, user } = response.data;
    this.setAuthToken(jwt);

    return { jwt, user };
  }

  async registerUser(
    username: string,
    email: string,
    password: string,
  ): Promise<{ jwt: string; user: User }> {
    const response: AxiosResponse = await axios.post(
      `${API_URL}/auth/local/register`,
      { username, email, password },
      { headers: { 'Content-Type': 'application/json' } },
    );

    const { jwt, user } = response.data;
    this.setAuthToken(jwt);

    return { jwt, user };
  }

  async getMe(): Promise<User | null> {
    try {
      const response = await this.api.get('/users/me');
      return response.data;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout endpoint failed, clearing token anyway');
    } finally {
      this.removeAuthToken();
    }
  }

  /* -------------------- COPY SHOPS -------------------- */

  async getCopyShops(
    productTemplateId?: number,
    numberOfPages?: number,
    quantity?: number,
    selectedOptions?: PrintOptions | string,
  ): Promise<CopyShop[]> {
    const params: Record<string, any> = {};

    if (productTemplateId !== undefined) params.productTemplateId = productTemplateId;
    if (numberOfPages !== undefined) params.numberOfPages = numberOfPages;
    if (quantity !== undefined) params.quantity = quantity;
    if (selectedOptions !== undefined) params.selectedOptions = selectedOptions;

    const response = await this.api.get('/print-shops', { params });
    return response.data;
  }

  /* -------------------- CART / ORDER -------------------- */

  async addToCart(payload: AddToCartPayload): Promise<Order | null> {
    try {
      const response = await this.api.post('/orders/add-to-cart', payload);
      return response.data;
    } catch {
      return null;
    }
  }

  async syncCart(payload: SyncCartPayload): Promise<Order> {
    const response = await this.api.put('/order/sync', payload);
    return response.data;
  }
  async getProductTemplatesByMime(documentMime: string) {
    try {
      const response = await this.api.get('/product-templates/by-mime', {
        params: {
          document_mime: documentMime
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product templates by mime:', error);
      return [];
    }
  }

  async getCartItemCount(orderId: string) {
    try {
      const response = await this.api.get(`/orders/${orderId}/items/count`);

      return response.data;
    } catch (error) {
      console.error('Error fetching cart item count:', error);
      return {
        orderId,
        count: 0
      };
    }
  }

  async getOrderItems(orderId: string) {
    try {
      const response = await this.api.get(`/order/${orderId}/items`);

      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }
}

export const strapiService = new StrapiService();
