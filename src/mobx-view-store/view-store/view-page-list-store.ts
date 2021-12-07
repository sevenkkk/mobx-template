import ViewBaseListStore from './base/view-base-list-store';
import { PageConfig, PaginationProp } from '../model/page';
import { action, computed, makeObservable, observable } from 'mobx';
import { UseResult } from '../model/use-result';
import { ListStoreConfig } from './view-list-store';
import { FetchConfig } from '../model/fetch-config';

export interface PageListStoreConfig<T, P> extends ListStoreConfig<T, P> {
	pageSize?: number,
}

export class ViewPageListStore<T, P = Record<string, any>> extends ViewBaseListStore<T, P> {

	current = 1;
	pageSize = 10;

	total = 0;

	constructor(public prepare: (params: P) => Promise<any>,
				public config?: PageListStoreConfig<T, P>,
	) {
		super();
		const {defaultParams, pageSize} = this.config || {};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				this.setParams(defaultParams());
			} else {
				this.setParams(defaultParams);
			}
		}

		if (pageSize) {
			this.setPageSize(pageSize);
		}

		this.setParams({
			current: this.current,
			pageSize: this.pageSize,
		} as any);

		makeObservable(this, {
			current: observable,
			pageSize: observable,
			total: observable,
			pagination: computed,
			loadDataPage: action.bound,
			setCurrent: action.bound,
			setPageSize: action.bound,
			setTotal: action.bound,
			loadData: action.bound,
		});
	}

	setCurrent(current: number) {
		this.current = current;
	}

	setPageSize(pageSize: number) {
		this.pageSize = pageSize;
	}

	setTotal(total: number) {
		this.total = total;
	}

	get pagination(): PaginationProp {
		return {
			total: this.total,
			current: this.current,
			pageSize: this.pageSize,
		};
	}

	loadData(params?: P, config?: PageConfig<T[]>): Promise<UseResult<T[]>> {
		const {current, pageSize, replace} = config || {};
		if (params) {
			if (replace) {
				this.setParams(params);
			} else {
				this.mergeParams(params);
			}
		}
		return this.doLoadData(current || this.current, pageSize || this.pageSize, config);
	}

	loadDataPage(config: PageConfig<T[]>): Promise<UseResult<T[]>> {
		const {current, pageSize} = config;
		return this.doLoadData(current || this.current, pageSize || this.pageSize, config);
	}

	private async doLoadData(current: number, pageSize: number, config?: FetchConfig<T[]>): Promise<UseResult<T[]>> {
		if (this.current !== current) {
			this.setCurrent(current);
		}
		if (this.pageSize !== pageSize) {
			this.setPageSize(pageSize);
		}
		// @ts-ignore
		this.mergeParams({current, pageSize});

		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};

		const res = await this.doFetch<T[]>(() => this.prepare(this.params), myConfig);
		const {success, data, total} = res;
		if (success) {
			const {isDefaultSet} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet && data) {
				this.setList(data);
				this.setTotal(total || 0);
			}
			if (this.config?.successCallback) {
				this.config?.successCallback(data || [], total || 0);
			}
			this.onLoadComplete(data || []);
		} else {
			if (this.config?.failCallback) {
				this.config?.failCallback(res);
			}
		}
		return {...res, data: this.list};
	}

}
