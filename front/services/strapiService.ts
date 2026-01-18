import axios, { type AxiosInstance, type AxiosResponse } from "axios"
import type { PrintJob, CopyShop, User, PrintOptions, AddToCartPayload, Order, ProductTemplate, SyncCartPayload, SyncCartResponse } from "../types"

class StrapiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_STRAPI_API_TOKEN || ""}`,
      },
    })

    // Add request interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Strapi API Error:", error.response?.data || error.message)
        return Promise.reject(error)
      },
    )
  }


  async getCopyShops(
    productTemplateId?: number,
    numberOfPages?: number,
    quantity?: number,
    selectedOptions?: string
  ): Promise<CopyShop[]> {
    try {
      // Build params object only with defined values
      const params: Record<string, any> = {};
      if (productTemplateId !== undefined) params.productTemplateId = productTemplateId;
      if (numberOfPages !== undefined) params.numberOfPages = numberOfPages;
      if (quantity !== undefined) params.quantity = quantity;
      if (selectedOptions !== undefined) params.selectedOptions = selectedOptions;

      const response: AxiosResponse<CopyShop[]> = await this.api.get("/print-shops", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching copy shops:", error);
      throw error;
    }
  }

  async getCopyShopById(id: string): Promise<CopyShop | null> {
    try {
      const response: AxiosResponse = await this.api.get(`/copy-shops/${id}?populate=*`)
      return this.transformCopyShop(response.data.data)
    } catch (error) {
      console.error("Error fetching copy shop:", error)
      return null
    }
  }

  async createCopyShop(shopData: Omit<CopyShop, "id">): Promise<CopyShop | null> {
    try {
      const response: AxiosResponse = await this.api.post("/copy-shops", {
        data: shopData,
      })
      return this.transformCopyShop(response.data.data)
    } catch (error) {
      console.error("Error creating copy shop:", error)
      return null
    }
  }

  async updateCopyShop(id: string, shopData: Partial<CopyShop>): Promise<CopyShop | null> {
    try {
      const response: AxiosResponse = await this.api.put(`/copy-shops/${id}`, {
        data: shopData,
      })
      return this.transformCopyShop(response.data.data)
    } catch (error) {
      console.error("Error updating copy shop:", error)
      return null
    }
  }

  async createPrintJob(jobData: Omit<PrintJob, "id" | "createdAt" | "updatedAt">): Promise<PrintJob | null> {
    try {
      const response: AxiosResponse = await this.api.post("/print-jobs", {
        data: {
          ...jobData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
      return this.transformPrintJob(response.data.data)
    } catch (error) {
      console.error("Error creating print job:", error)
      return null
    }
  }

  async getPrintJobs(filters?: { userId?: string; shopId?: string; status?: string }): Promise<PrintJob[]> {
    try {
      let url = "/print-jobs?populate=*"

      if (filters) {
        const filterParams = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            filterParams.append(`filters[${key}][$eq]`, value)
          }
        })
        if (filterParams.toString()) {
          url += `&${filterParams.toString()}`
        }
      }

      const response: AxiosResponse = await this.api.get(url)
      return response.data.data.map(this.transformPrintJob)
    } catch (error) {
      console.error("Error fetching print jobs:", error)
      return []
    }
  }

  async updatePrintJobStatus(id: string, status: PrintJob["status"]): Promise<PrintJob | null> {
    try {
      const response: AxiosResponse = await this.api.put(`/print-jobs/${id}`, {
        data: {
          status,
          updatedAt: new Date().toISOString(),
        },
      })
      return this.transformPrintJob(response.data.data)
    } catch (error) {
      console.error("Error updating print job status:", error)
      return null
    }
  }

  async createUser(userData: Omit<User, "id" | "printHistory" | "createdAt">): Promise<User | null> {
    try {
      const response: AxiosResponse = await this.api.post("/users", {
        data: {
          ...userData,
          printHistory: [],
          createdAt: new Date().toISOString(),
        },
      })
      return this.transformUser(response.data.data)
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  }

  async loginUser(identifier: string, password: string): Promise<{ jwt: string; user: User } | null> {
    try {
      const response: AxiosResponse = await this.api.post("/auth/local", {
        identifier, // can be email or username
        password,
      });

      // Strapi returns { jwt, user }
      const { jwt, user } = response.data;

      // Transform the user into your User type
      const transformedUser: User = this.transformUser({
        id: user.id,
        attributes: {
          email: user.email,
          name: user.username || user.name,
          role: user.app_role,
          phone: user.phone,
          address: user.address,
          printHistory: user.printHistory || [],
          createdAt: user.createdAt,
        },
      });

      return { jwt, user };
    } catch (error) {
      console.error("Error logging in user:", error);
      return null;
    }
  }


  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response: AxiosResponse = await this.api.get(`/users?filters[email][$eq]=${email}&populate=*`)
      const users = response.data.data
      return users.length > 0 ? this.transformUser(users[0]) : null
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response: AxiosResponse = await this.api.put(`/users/${id}`, {
        data: userData,
      })
      return this.transformUser(response.data.data)
    } catch (error) {
      console.error("Error updating user:", error)
      return null
    }
  }

  private transformCopyShop(data: any): CopyShop {
    return {
      id: data.id.toString(),
      name: data.attributes.name,
      address: data.attributes.address,
      city: data.attributes.city,
      phone: data.attributes.phone,
      email: data.attributes.email,
      coordinates: data.attributes.coordinates,
      pricing: data.attributes.pricing,
      services: data.attributes.services || [],
      workingHours: data.attributes.workingHours,
      rating: data.attributes.rating || 0,
      isActive: data.attributes.isActive !== false,
    }
  }

  private transformPrintJob(data: any): PrintJob {
    return {
      id: data.id.toString(),
      fileName: data.attributes.fileName,
      fileUrl: data.attributes.fileUrl,
      fileSize: data.attributes.fileSize,
      pageCount: data.attributes.pageCount,
      printOptions: data.attributes.printOptions,
      shopId: data.attributes.shopId,
      userId: data.attributes.userId,
      status: data.attributes.status,
      totalCost: data.attributes.totalCost,
      createdAt: new Date(data.attributes.createdAt),
      updatedAt: new Date(data.attributes.updatedAt),
    }
  }

  private transformUser(data: any): User {
    return {
      id: data.id.toString(),
      email: data.attributes.email,
      name: data.attributes.name,
      phone: data.attributes.phone,
      address: data.attributes.address,
      printHistory: data.attributes.printHistory || [],
      createdAt: new Date(data.attributes.createdAt),
    }
  }

  async sendOrderConfirmation(printJob: PrintJob, userEmail: string): Promise<boolean> {
    try {
      await this.api.post("/email", {
        to: userEmail,
        subject: "Potvrda narudžbe - PrintSerbia",
        template: "order-confirmation",
        data: {
          fileName: printJob.fileName,
          totalCost: printJob.totalCost,
          orderId: printJob.id,
        },
      })
      return true
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  }

  async sendOrderReady(printJob: PrintJob, userEmail: string): Promise<boolean> {
    try {
      await this.api.post("/email", {
        to: userEmail,
        subject: "Vaša narudžba je spremna - PrintSerbia",
        template: "order-ready",
        data: {
          fileName: printJob.fileName,
          orderId: printJob.id,
        },
      })
      return true
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  }
  async addToCart(payload: AddToCartPayload): Promise<string | null> {
    try {
      const response: AxiosResponse = await this.api.post("/orders/add-to-cart", {
        ...payload
        // order_code: payload.orderCode,
        // document_s3_key: payload.documentS3Key,
        // file_name: payload.fileName,
        // copies: payload.copies,
        // color: payload.color,
        // binding: payload.binding,
        // pages: payload.pages,
        // price: payload.price,
        // customer_email: payload.customerEmail,
        // customer_phone: payload.customerPhone,
        // print_shop_id: payload.printShopId,
      })
      return response.data
    } catch (error) {
      console.error("Error adding item to cart:", error)
      return null
    }
  }
  async getProductTemplatesByMime(documentMime: string) {
    try {
      const response = await this.api.get(
        "/product-templates/by-mime",
        {
          params: {
            document_mime: documentMime,
          },
        }
      )
      return response.data.data
    } catch (error) {
      console.error("Error fetching product templates by mime:", error)
      return []
    }
  }
  async getCartItemCount(orderId: string) {
    try {
      const response = await this.api.get(
        `/orders/${orderId}/items/count`
      )

      return response.data
    } catch (error) {
      console.error("Error fetching cart item count:", error)
      return {
        orderId,
        count: 0,
      }
    }
  }
  async getOrderItems(orderId: string) {
    try {
      const response = await this.api.get(
        `/order/${orderId}/items`
      )

      return response.data
    } catch (error) {
      console.error("Error fetching cart items:", error)
      throw error
    }
  }
  async syncCart(payload: SyncCartPayload): Promise<SyncCartResponse> {
    try {
      const response = await this.api.put('/order/sync', payload);
      return response.data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
}


export const strapiService = new StrapiService()
