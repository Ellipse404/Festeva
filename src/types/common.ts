export enum EventCategoryEnum {
  ALL = 'all',
  BIRTHDAY = 'birthday',
  RECEPTION = 'reception',
  RICE_CEREMONY = 'rice_ceremony',
  ANNIVERSARY = 'anniversary',
  OTHERS = 'others',
}

export enum NavViewEnum {
  DASHBOARD = 'dashboard',
  HOST = 'host',
  ATTEND = 'attend',
  SETTINGS = 'settings',
}

export enum SortByEnum {
  DISTANCE = 'distance',
  DATE = 'date',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

export enum TicketStatusEnum {
  ACTIVE = 'active',
  USED = 'used',
  CANCELLED = 'cancelled',
}

export interface BaseEntity {
  id: string;
  createdAt: string;
}
