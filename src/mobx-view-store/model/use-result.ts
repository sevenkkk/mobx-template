/**
 * API return value object
 */
export interface UseResult<T> {
  success?: boolean;
  data?: T;
  errorMessage?: string;
  totalCount?: number;
  errorCode?: string;
  status?: number;
}
