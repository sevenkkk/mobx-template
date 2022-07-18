import ViewBaseListStore from './base/view-base-list-store';
import { PageConfig, PaginationProp } from '../model/page';
import { action, computed, makeObservable, observable } from 'mobx';
import { UseResult } from '../model/use-result';
import { ListStoreConfig } from './view-list-store';
import { FetchConfig } from '../model/fetch-config';
import { getRequest } from '../utils/request';
import { ConfigService } from '../config-service';

export interface PageListStoreConfig<T, P> extends ListStoreConfig<T, P> {
	pageSize?: number,
}

export class ViewPageListStore<T, P = Record<string, any>> extends ViewBaseListStore<T, P> {

	page = 1;
	pageSize = 10;

	total = 0;

	hasMore = false;

	constructor(public prepare: ((params: P) => Promise<any>) | string,
	            public config?: PageListStoreConfig<T, P>,
	) {
		super();
		const {defaultParams, pageSize} = this.config || {};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				// @ts-ignore
				this.setDefaultParams(defaultParams());
			} else {
				this.setDefaultParams(defaultParams);
			}
			this.setParams(this.defaultParams!);
		}

		if (pageSize !== undefined) {
			this.setPageSize(pageSize);
		}

		this.reload = (_config?: { removeCount?: number, resetPageIndex?: boolean }) => {
			const {removeCount, resetPageIndex} = _config || {};
			if (removeCount && removeCount > 0) {
				const _page = this.list.length === removeCount && this.page > 1 ? this.page - 1 : this.page;
				return this.loadData(undefined, {page: _page});
			}
			return this.loadData(undefined, {page: resetPageIndex ? this.page : undefined});
		};

		makeObservable(this, {
			page: observable,
			pageSize: observable,
			hasMore: observable,
			total: observable,
			pagination: computed,
			loadDataPage: action.bound,
			setPage: action.bound,
			setPageSize: action.bound,
			setTotal: action.bound,
			loadData: action.bound,
			setOriginList: action.bound,
			setHasMore: action.bound,
		});
	}

	reload: ((config?: { removeCount?: number, resetPageIndex?: boolean }) => Promise<any>);

	setPage(page: number) {
		this.page = page;
	}

	setHasMore(hasMore: boolean) {
		this.hasMore = hasMore;
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
			page: this.page,
			pageSize: this.pageSize,
		};
	}

	loadData(params?: Partial<P> | P, config?: PageConfig<T[], P>): Promise<UseResult<T[]>> {
		const {page, pageSize, replace, defaultParams, autoClear} = {
			...(this.config || {}),
			...(config || {}),
		};

		if (autoClear) {
			this.clear();
		}
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				// @ts-ignore
				this.setDefaultParams(defaultParams());
			} else {
				this.setDefaultParams(defaultParams);
			}
		}
		if (params) {
			const _params = this.defaultParams ? {...this.defaultParams, ...params} : params;
			if (replace) {
				this.setParams(_params);
			} else {
				this.mergeParams(_params);
			}
		} else if (this.defaultParams) {
			// 解决第一次没有设置成功
			this.mergeParams(this.defaultParams);
		}
		this.setHasMore(false);
		return this.doLoadData(page || 1, pageSize !== undefined ? pageSize : this.pageSize, config);
	}

	loadDataPage(config: PageConfig<T[], P>): Promise<UseResult<T[]>> {
		const {page, pageSize} = config;
		return this.doLoadData(page || this.page, pageSize !== undefined ? pageSize : this.pageSize, config);
	}

	private async doLoadData(page: number, pageSize: number, config?: FetchConfig<T[]>): Promise<UseResult<T[]>> {
		if (this.page !== page) {
			this.setPage(page);
		}
		if (this.pageSize !== pageSize) {
			this.setPageSize(pageSize);
		}

		this.config = {
			showMessage: true,
			showSuccessMessage: false,
			showErrorMessage: true,
			...(this.config || {}),
			...(config || {}),
		};

		if (this.config?.defaultIndex !== undefined && this.index < 0) {
			this.setIndex(this.config?.defaultIndex);
		}

		let myParams = this.config.postParams ? this.config.postParams(this.params as P) : this.params;

		myParams = {...myParams, ...(ConfigService.config.handlePage ? ConfigService.config.handlePage(this.page, this.pageSize) : {})};

		const res = await this.doFetch<T[]>(() => {
			if (typeof this.prepare === 'function') {
				return this.prepare(myParams as P);
			} else {
				return getRequest(this.config?.method ?? 'POST', (this.prepare as string), myParams as P, this.config);
			}
		}, this.config);
		const {success, data, total} = res;
		if (success) {
			if (total! > pageSize * this.page) {
				this.setHasMore(true);
			} else {
				this.setHasMore(false);
			}
			// 设置原始数据
			this.setOriginList(data ?? []);
			const {isDefaultSet, postData} = {isDefaultSet: true, ...(this.config || {})};
			let _list = data ?? [];
			if (isDefaultSet && data) {
				if (postData) {
					_list = postData(data);
				}
				this.setList(_list);
				this.setTotal(total || 0);
			}
			if (this.config?.successCallback) {
				this.config?.successCallback(_list, total || 0);
			}
			this.onLoadComplete(_list);
		} else {
			if (this.config?.failCallback) {
				this.config?.failCallback(res);
			}
		}
		return {...res, data: this.list};
	}


	// 加载更多
	async loadMore() {
		this.setPage(this.page + 1);

		let myParams = this.config?.postParams ? this.config?.postParams(this.params as P) : this.params;

		myParams = {...myParams, ...(ConfigService.config.handlePage ? ConfigService.config.handlePage(this.page, this.pageSize) : {})};

		const res = await this.doFetch<T[]>(() => {
			if (typeof this.prepare === 'function') {
				return this.prepare(myParams as P);
			} else {
				return getRequest(this.config?.method ?? 'POST', (this.prepare as string), myParams as P, this.config);
			}
		}, {showMessage: false, status: false});
		const {success, data: _data, total} = res;
		if (success) {
			if (total! > this.pageSize * this.page) {
				this.setHasMore(true);
			} else {
				this.setHasMore(false);
			}
			// 设置原始数据
			const list = this.list.map(item => item);
			const data = list.concat(_data ?? []);
			this.setOriginList(data);
			const {isDefaultSet, postData} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet && data) {
				let _list = data;
				if (postData) {
					_list = postData(data);
				}
				this.setList(_list);
				this.setTotal(total || 0);
			}
			if (this.config?.successCallback) {
				this.config?.successCallback(data || [], total || 0);
			}
			this.onLoadComplete(data || []);
		} else {
			this.page--;
			if (this.config?.failCallback) {
				this.config?.failCallback(res);
			}
		}
		return {...res, data: this.list};
	}

	onLoadComplete(list: T[]) {
		if (list.length === 0) {
			this.empty();
		}
	}

	clear() {
		this.setHasMore(false);
		this.setPage(1);
		this.setTotal(0);
		super.clear();
	}

}
