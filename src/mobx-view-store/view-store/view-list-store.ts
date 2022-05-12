import ViewBaseListStore from './base/view-base-list-store';
import { UseResult } from '../model/use-result';
import { action, makeObservable, override } from 'mobx';
import { FetchConfig } from '../model/fetch-config';

export type getDefaultParams<T> = () => T;

export interface ListStoreConfig<T, P> {
	isDefaultSet?: boolean,
	successCallback?: (data: T[], total?: number) => void,
	failCallback?: (res: UseResult<any>) => void
	defaultParams?: Partial<P> | getDefaultParams<Partial<P>>,
	postData?: (data: T[]) => T[],
	autoLoad?: boolean | getDefaultParams<Partial<P>>;
	autoClear?: boolean;
}

export interface ListConfig<T, P> extends FetchConfig<T> {
	defaultParams?: Partial<P> | getDefaultParams<Partial<P>>,
}

export class ViewListStore<T, P = Record<string, any>> extends ViewBaseListStore<T, P> {

	constructor(public prepare: (params: P) => Promise<any>,
	            public config?: ListStoreConfig<T, P>) {
		super();
		const {defaultParams} = this.config || {isDefaultSet: true};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				this.setDefaultParams(defaultParams());
			} else {
				this.setDefaultParams(defaultParams);
			}
			this.setParams(this.defaultParams!);
		}

		this.reload = (_config?: { removeCount?: number, resetPageIndex?: boolean }) => {
			return this.loadData();
		};
		makeObservable(this, {loadData: action.bound, clear: override, setOriginList: action.bound});
	}


	async loadData(params?: Partial<P> | P, config?: ListConfig<T[], P>): Promise<UseResult<T[]>> {
		const {defaultParams} = config || {};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				this.setDefaultParams(defaultParams());
			} else {
				this.setDefaultParams(defaultParams);
			}
		}
		if (params) {
			const _params = this.defaultParams ? {...this.defaultParams, ...params} : params;
			if (config?.replace) {
				this.setParams(_params);
			} else {
				this.mergeParams(_params);
			}
		}else if(this.defaultParams){
			// 解决第一次没有设置成功
			this.mergeParams(this.defaultParams);
		}
		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T[]>(() => this.prepare(this.params), myConfig);
		const {success, data} = res;
		if (success) {
			// 设置原始数据
			this.setOriginList(data ?? []);
			const {isDefaultSet, postData} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet && data) {
				let _list = data;
				if (postData) {
					_list = postData(data);
				}
				this.setList(_list);
			}

			if (this.config?.successCallback) {
				this.config?.successCallback(data || []);
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
