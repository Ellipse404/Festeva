export interface ITicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  posterUrl: string;
  quantity: number;
  unitPrice: number;
  totalPaid: number;
  purchaseDate: string;
  qrCode: string;
  status: 'active' | 'used' | 'cancelled';
}
