import ViewBaseListStore from './base/view-base-list-store';
import { UseResult } from '../model/use-result';
import { action, makeObservable, override } from 'mobx';
import { FetchConfig } from '../model/fetch-config';
import { getRequest } from '../utils/request';

export type getDefaultParams<T> = () => T;

export interface ListStoreConfig<T, P> extends ListConfig<T, P> {
	isDefaultSet?: boolean,
	defaultParams?: P | Partial<P> | getDefaultParams<Partial<P> | P>,
	postData?: (data: any[]) => T[],
	postParams?: (params: P) => any,
	autoLoad?: boolean | getDefaultParams<Partial<P> | P>;
	autoClear?: boolean;
	defaultIndex?: number;
}

export interface ListConfig<T, P> extends FetchConfig<T[]> {
	defaultParams?: P | Partial<P> | getDefaultParams<Partial<P> | P>,
	autoClear?: boolean;
}

export class ViewListStore<T, P = Record<string, any>> extends ViewBaseListStore<T, P> {

	reload: (() => Promise<any>);

	constructor(public prepare: ((params: P) => Promise<any>) | string,
	            public config?: ListStoreConfig<T, P>) {
		super();
		const {defaultParams} = this.config || {isDefaultSet: true};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				// @ts-ignore
				this.setDefaultParams(defaultParams());
			} else {
				this.setDefaultParams(defaultParams);
			}
			this.setParams(this.defaultParams!);
		}

		this.reload = () => {
			return this.loadData(undefined);
		};
		makeObservable(this, {loadData: action.bound, clear: override, setOriginList: action.bound});
	}

	async loadData(params?: Partial<P> | P, config?: ListConfig<T[], P>): Promise<UseResult<T[]>> {
		const {defaultParams, autoClear} = {
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
			if (config?.replace) {
				this.setParams(_params);
			} else {
				this.mergeParams(_params);
			}
		} else if (this.defaultParams) {
			// 解决第一次没有设置成功
			this.mergeParams(this.defaultParams);
		}
		const myConfig = {
			showMessage: true,
			showSuccessMessage: false,
			showErrorMessage: true,
			...(this.config || {}),
			...(config || {}),
		};

		if (this.config?.defaultIndex !== undefined && this.index < 0) {
			this.setIndex(this.config?.defaultIndex);
		}
		const myParams = myConfig.postParams ? myConfig.postParams(this.params as P) : this.params;
		const res = await this.doFetch<T[]>(() => {
			if (typeof this.prepare === 'function') {
				return this.prepare(myParams as P);
			} else {
				return getRequest(this.config?.method ?? (myParams ? 'POST' : 'GET'), (this.prepare as string), (myParams ?? (this.config?.method === 'POST' || this.config?.method === 'post' ? {} : undefined)) as P, {needAuth: myConfig?.needAuth});
			}
		}, myConfig as FetchConfig<T[]>);
		const {success, data} = res;
		if (success) {
			// 设置原始数据
			this.setOriginList(data ?? []);
			const {isDefaultSet, postData} = {isDefaultSet: true, ...(this.config || {})};
			let _list = data ?? [];
			if (isDefaultSet && data) {
				if (postData) {
					_list = postData(data);
				}
				this.setList(_list);
			}

			if (myConfig?.successCallback) {
				myConfig?.successCallback(_list as any);
			}
			this.onLoadComplete(_list);
		} else {
			if (myConfig?.failCallback) {
				myConfig?.failCallback(res);
			}
		}

		return {...res, data: this.list};
	}

}
