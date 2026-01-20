import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
  PrintJob,
  CopyShop,
  User,
  AddToCartPayload,
  SyncCartPayload,
  Order,
  PrintOptions,
} from '../types';

class StrapiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_STRAPI_API_TOKEN || ''}`,
      },
    });

    // Add request interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Strapi API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }

  async getCopyShops(
    productTemplateId?: number,
    numberOfPages?: number,
    quantity?: number,
    selectedOptions?: PrintOptions | string,
  ): Promise<CopyShop[]> {
    try {
      // Build params object only with defined values
      const params: Record<string, any> = {};
      if (productTemplateId !== undefined) params.productTemplateId = productTemplateId;
      if (numberOfPages !== undefined) params.numberOfPages = numberOfPages;
      if (quantity !== undefined) params.quantity = quantity;
      if (selectedOptions !== undefined) params.selectedOptions = selectedOptions;

      const response: AxiosResponse<CopyShop[]> = await this.api.get('/print-shops', {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching copy shops:', error);
      throw error;
    }
  }

  async loginUser(
    identifier: string,
    password: string,
  ): Promise<{ jwt: string; user: User } | null> {
    try {
      const response: AxiosResponse = await this.api.post('/auth/local', {
        identifier, // can be email or username
        password,
      });

      // Strapi returns { jwt, user }
      const { jwt, user } = response.data;

      return { jwt, user };
    } catch (error) {
      console.error('Error logging in user:', error);
      return null;
    }
  }

  async sendOrderConfirmation(printJob: PrintJob, userEmail: string): Promise<boolean> {
    try {
      await this.api.post('/email', {
        to: userEmail,
        subject: 'Potvrda narudžbe - PrintSerbia',
        template: 'order-confirmation',
        data: {
          fileName: printJob.fileName,
          totalCost: printJob.totalCost,
          orderId: printJob.id,
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendOrderReady(printJob: PrintJob, userEmail: string): Promise<boolean> {
    try {
      await this.api.post('/email', {
        to: userEmail,
        subject: 'Vaša narudžba je spremna - PrintSerbia',
        template: 'order-ready',
        data: {
          fileName: printJob.fileName,
          orderId: printJob.id,
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  async addToCart(payload: AddToCartPayload): Promise<Order | null> {
    try {
      const response: AxiosResponse = await this.api.post('/orders/add-to-cart', {
        ...payload,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return null;
    }
  }
  async getProductTemplatesByMime(documentMime: string) {
    try {
      const response = await this.api.get('/product-templates/by-mime', {
        params: {
          document_mime: documentMime,
        },
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
        count: 0,
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
  async syncCart(payload: SyncCartPayload): Promise<Order> {
    try {
      const response = await this.api.put('/order/sync', payload);
      return response.data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
}

export const strapiService = new StrapiService();
