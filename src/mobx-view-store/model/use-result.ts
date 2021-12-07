/**
 * API return value object
 */
export interface UseResult<T> {
  success?: boolean;
  data?: T;
  errorMessage?: string;
  total?: number;
  errorCode?: string;
  status?: number;
}
