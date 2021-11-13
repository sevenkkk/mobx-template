import ViewBaseListStore from './base/view-base-list-store';
import { PageConfig, PageView } from '../model/page';
import { action, computed, makeObservable, observable } from 'mobx';
import { UseResult } from '../model/use-result';
import { ListStoreConfig } from './view-list-store';
import { FetchConfig } from '../model/fetch-config';

export interface PageListStoreConfig<P, T> extends ListStoreConfig<P, T> {
	pageSize?: number,
}

export class ViewPageListStore<P, T> extends ViewBaseListStore<P, T> {

	page = 1;
	pageSize = 10;

	count: number = 0;

	constructor(public prepare: (params: P) => Promise<any>,
				public config?: PageListStoreConfig<P, T>,
	) {
		super();
		const {defaultParams, pageSize} = this.config || {isDefaultSet: true};
		if (defaultParams) {
			this.setParams(defaultParams);
		}

		if (pageSize) {
			this.setPageSize(pageSize);
		}

		// @ts-ignore
		this.setParams({
			page: this.page,
			pageSize: this.pageSize,
		});

		makeObservable(this, {
			page: observable,
			pageSize: observable,
			count: observable,
			pages: computed,
			loadDataPage: action.bound,
			setPage: action.bound,
			setPageSize: action.bound,
			setCount: action.bound,
			loadData: action.bound,
		});
	}

	setPage(page: number) {
		this.page = page;
	}

	setPageSize(pageSize: number) {
		this.pageSize = pageSize;
	}

	setCount(count: number) {
		this.count = count;
	}

	get pages(): PageView<T> {
		return {count: this.count, page: this.page, pageSize: this.pageSize, loadDataPage: this.loadDataPage};
	}

	loadData(params?: P, config?: PageConfig<T[]>): Promise<UseResult<T[]>> {
		if (params) {
			this.setParams(params);
		}
		const {page, pageSize} = config || {};
		return this.doLoadData(page || this.page, pageSize || this.pageSize, config);
	}

	loadDataPage(config: PageConfig<T[]>): Promise<UseResult<T[]>> {
		const {page, pageSize} = config;
		return this.doLoadData(page || this.page, pageSize || this.pageSize, config);
	}

	private async doLoadData(page: number, pageSize: number, config?: FetchConfig<T[]>): Promise<UseResult<T[]>> {
		if (this.page !== page) {
			this.setPage(page);
		}
		if (this.pageSize !== pageSize) {
			this.setPageSize(pageSize);
		}
		// @ts-ignore
		this.setParams({page, pageSize});

		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};

		const res = await this.doFetch<T[]>(() => this.prepare(this.params), myConfig);
		const {success, data, totalCount} = res;
		if (success) {
			const {isDefaultSet} = this.config || {isDefaultSet: true};
			if (isDefaultSet && data) {
				this.setList(data);
				this.setCount(totalCount || 0);
			}
			if (this.config?.successCallback) {
				this.config?.successCallback(this.list);
			}
			this.onLoadComplete(this.list);
		} else {
			if (this.config?.failCallback) {
				this.config?.failCallback(res);
			}
		}
		return res;
	}

}
