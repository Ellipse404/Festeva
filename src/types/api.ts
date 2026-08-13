export interface ApiFetchResult<T> {
  data: T;
  isConnected: boolean;
  error?: string;
}
