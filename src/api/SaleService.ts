import axios, { AxiosResponse } from "axios";

const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
// Interfaces
export interface SaleItem {
  itemId: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  image?: string;
}

export interface Sale {
  _id?: string;
  userId: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress;
  discount?: number;
  couponCode?: string;
  status: SaleStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deliveredAt?: Date;
}

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export enum SaleStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PIX = "PIX",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
}

export interface CreateSaleRequest {
  userId: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress;
  discount?: number;
  couponCode?: string;
  notes?: string;
}

export interface CreateSaleFromCartRequest {
  userId: string;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress;
  notes?: string;
}

export interface SaleResponse {
  message: string;
  saleId: string;
  sale: Sale;
}

export interface GetSalesParams {
  userId?: string;
  status?: SaleStatus;
  startDate?: string;
  endDate?: string;
}

class SaleService {
  private api = axios.create({
    baseURL: SERVER_ADDRESS,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Busca todas as vendas com filtros opcionais
   */
  async getSales(params?: GetSalesParams): Promise<Sale[]> {
    try {
      const response: AxiosResponse<Sale[]> = await this.api.get("/sale", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      throw error;
    }
  }

  /**
   * Busca uma venda pelo ID
   */
  async getSaleById(id: string): Promise<Sale> {
    try {
      const response: AxiosResponse<Sale> = await this.api.get(`/sale/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar venda:", error);
      throw error;
    }
  }

  /**
   * Busca vendas por usuário
   */
  async getSalesByUser(userId: string): Promise<Sale[]> {
    try {
      const response: AxiosResponse<Sale[]> = await this.api.get(
        `/sale/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar vendas do usuário:", error);
      throw error;
    }
  }

  /**
   * Cria uma nova venda
   */
  async createSale(saleData: CreateSaleRequest): Promise<SaleResponse> {
    try {
      const response: AxiosResponse<SaleResponse> = await this.api.post(
        "/sale",
        saleData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      throw error;
    }
  }

  /**
   * Cria uma venda a partir do carrinho
   */
  async createSaleFromCart(
    saleData: CreateSaleFromCartRequest
  ): Promise<SaleResponse> {
    try {
      const response: AxiosResponse<SaleResponse> = await this.api.post(
        "/sale/from-cart",
        saleData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar venda do carrinho:", error);
      throw error;
    }
  }

  /**
   * Atualiza o status de uma venda
   */
  async updateSaleStatus(
    id: string,
    status: SaleStatus
  ): Promise<{ message: string; sale: Sale }> {
    try {
      const response: AxiosResponse<{ message: string; sale: Sale }> =
        await this.api.put(`/sale/${id}/status`, {
          status,
        });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status da venda:", error);
      throw error;
    }
  }

  /**
   * Cancela uma venda
   */
  async cancelSale(id: string): Promise<{ message: string; sale: Sale }> {
    try {
      const response: AxiosResponse<{ message: string; sale: Sale }> =
        await this.api.put(`/sales/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Erro ao cancelar venda:", error);
      throw error;
    }
  }

  /**
   * Remove uma venda
   */
  async deleteSale(id: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> =
        await this.api.delete(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao remover venda:", error);
      throw error;
    }
  }
}

export default new SaleService();
