export interface IApiFetchResult<T> {
  data: T;
  isConnected: boolean;
  error?: string;
}
