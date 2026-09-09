import { IEventItem } from './events';

export interface ITicket {
  id: string;
  eventId: string;
  orderId?: string;
  userId?: string;
  eventTitle?: string;
  eventCategory?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  posterUrl?: string;
  quantity?: number;
  unitPrice?: number;
  totalPaid?: number;
  purchaseDate?: string;
  qrCode?: string;
  ticketCode?: string;
  qrCodeDataUrl?: string;
  createdAt?: string;
  status: 'active' | 'used' | 'cancelled' | 'VALID' | 'USED' | 'CANCELLED';
  event?: IEventItem;
}
