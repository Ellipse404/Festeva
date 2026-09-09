import { IEventItem } from './events';
import { ITicket } from './tickets';

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED';

export interface ICreateOrderResponse {
  success: boolean;
  orderId: string;
  cfOrderId: string;
  paymentSessionId: string;
  amount: number;
  ticketQuantity: number;
  isRealGateway: boolean;
  expiresAt: string;
}

export interface IOrder {
  id: string;
  userId?: string;
  eventId: string;
  cfOrderId: string;
  paymentSessionId?: string;
  amount: number;
  currency: string;
  ticketQuantity: number;
  status: OrderStatus;
  customerName?: string;
  customerEmail?: string;
  paymentId?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface IVerifyPaymentResponse {
  success: boolean;
  order: IOrder;
  tickets: ITicket[];
  message: string;
}
