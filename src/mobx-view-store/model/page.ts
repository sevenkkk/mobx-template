import { UseResult } from './use-result';
import { FetchConfig } from './fetch-config';

export interface PageView<T> {
	page: number
	pageSize: number
	count: number
	loadDataPage: (config: PageConfig<T[]>) => Promise<UseResult<T[]>>
}

export interface PageConfig<T> extends FetchConfig<T>{
	page: number;
	pageSize: number;
}
