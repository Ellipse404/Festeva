import { axiosClient } from '../config';
import { ENDPOINTS } from '../constants';
import { ICreateOrderResponse, IVerifyPaymentResponse, ITicket } from '../types';

export const paymentsApi = {
  /**
   * Create Cashfree Order & Reserve Seats
   */
  async createOrder(data: {
    eventId: string;
    ticketQuantity: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    userId?: string;
  }): Promise<ICreateOrderResponse> {
    const response = await axiosClient.post<ICreateOrderResponse>(
      ENDPOINTS.PAYMENTS.CREATE_ORDER,
      data,
    );
    return response.data;
  },

  /**
   * Verify Cashfree Payment & Issue QR Code Tickets
   */
  async verifyPayment(cfOrderId: string, userId?: string): Promise<IVerifyPaymentResponse> {
    const response = await axiosClient.post<IVerifyPaymentResponse>(
      ENDPOINTS.PAYMENTS.VERIFY,
      { cfOrderId, userId },
    );
    return response.data;
  },

  /**
   * Fetch all tickets owned by logged-in user
   */
  async getMyTickets(): Promise<ITicket[]> {
    const response = await axiosClient.get<ITicket[]>(
      ENDPOINTS.PAYMENTS.MY_TICKETS,
    );
    return response.data;
  },
};
