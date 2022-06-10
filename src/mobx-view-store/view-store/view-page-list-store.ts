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

	hasMore = false;

	constructor(public prepare: (params: P) => Promise<any>,
	            public config?: PageListStoreConfig<T, P>,
	) {
		super();
		const {defaultParams, pageSize} = this.config || {};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				this.setDefaultParams(defaultParams());
			} else {
				this.setDefaultParams(defaultParams);
			}
			this.setParams(this.defaultParams!);
		}

		if (pageSize) {
			this.setPageSize(pageSize);
		}

		this.setParams({
			current: this.current,
			pageSize: this.pageSize,
		} as any);

		this.reload = (_config?: { removeCount?: number, resetPageIndex?: boolean }) => {
			const {removeCount, resetPageIndex} = _config || {};
			if (removeCount && removeCount > 0) {
				const _current = this.list.length === removeCount && this.current > 1 ? this.current - 1 : this.current;
				return this.loadData(undefined, {current: _current});
			}
			return this.loadData(undefined, {current: resetPageIndex ? this.current : undefined});
		};

		makeObservable(this, {
			current: observable,
			pageSize: observable,
			hasMore: observable,
			total: observable,
			pagination: computed,
			loadDataPage: action.bound,
			setCurrent: action.bound,
			setPageSize: action.bound,
			setTotal: action.bound,
			loadData: action.bound,
			setOriginList: action.bound,
			setHasMore: action.bound,
		});
	}

	setCurrent(current: number) {
		this.current = current;
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
			current: this.current,
			pageSize: this.pageSize,
		};
	}

	loadData(params?: Partial<P> | P, config?: PageConfig<T[], P>): Promise<UseResult<T[]>> {
		const {current, pageSize, replace, defaultParams} = config || {};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
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
		return this.doLoadData(current || 1, pageSize || this.pageSize, config);
	}

	loadDataPage(config: PageConfig<T[], P>): Promise<UseResult<T[]>> {
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
		this.mergeParams({current, page: current, pageSize});

		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};

		const res = await this.doFetch<T[]>(() => this.prepare(this.params), myConfig);
		const {success, data, total} = res;
		if (success) {
			if (total! > pageSize * this.current) {
				this.setHasMore(true);
			} else {
				this.setHasMore(false);
			}
			// 设置原始数据
			this.setOriginList(data ?? []);
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
			if (this.config?.failCallback) {
				this.config?.failCallback(res);
			}
		}
		return {...res, data: this.list};
	}


	// 加载更多
	async loadMore() {
		this.setCurrent(this.current + 1);
		// @ts-ignore
		this.mergeParams({page: this.current});
		const res = await this.doFetch<T[]>(() => this.prepare(this.params), {showMessage: false, status: false});
		const {success, data: _data, total} = res;
		if (success) {
			if (total! > this.pageSize * this.current) {
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
			this.current--;
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
		this.setCurrent(1);
		this.setPageSize(this.config?.pageSize ?? 10);
		this.setTotal(0);
		super.clear();
	}

}
