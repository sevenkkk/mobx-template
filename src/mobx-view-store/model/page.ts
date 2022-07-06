import { FetchConfig } from './fetch-config';
import { getDefaultParams } from '../view-store/view-list-store';

export interface PaginationProp {
	current: number
	pageSize: number
	total: number
}

export interface PageConfig<T, P> extends FetchConfig<T> {
	current?: number;
	pageSize?: number;
	replace?: boolean;
	defaultParams?: Partial<P> | getDefaultParams<Partial<P>>,
	autoClear?: boolean;
}
