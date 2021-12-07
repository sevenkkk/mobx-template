import { FetchConfig } from './fetch-config';

export interface PaginationProp {
	current: number
	pageSize: number
	total: number
}

export interface PageConfig<T> extends FetchConfig<T>{
	current?: number;
	pageSize?: number;
	replace?: boolean;
}
