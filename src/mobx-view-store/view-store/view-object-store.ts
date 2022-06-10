import { action, makeObservable, observable } from 'mobx';
import { BaseViewStore } from './base/base-view-store';
import { UseResult } from '../model/use-result';
import { FetchConfig } from '../model/fetch-config';

type getDefaultParams<T> = () => T;

export interface ObjStoreConfig<T, P> {
	isDefaultSet?: boolean,
	successCallback?: (data: T) => void,
	failCallback?: (res: UseResult<any>) => void
	defaultParams?: Partial<P> | getDefaultParams<Partial<P>>,
	postData?: (data: T) => T,
	autoLoad?: boolean | getDefaultParams<Partial<P>>;
	autoClear?: boolean;
}

export interface ObjConfig<T, P> extends FetchConfig<T> {
	defaultParams?: Partial<P> | getDefaultParams<Partial<P>>,
}

export class ViewObjStore<T, P = Record<string, any>> extends BaseViewStore {

	// 原始数据
	originData: T | any = undefined;

	data: T | any = undefined;

	params: P | any = undefined;

	defaultParams: P | any = undefined;

	constructor(public prepare: (params: P) => Promise<any>,
	            public config?: ObjStoreConfig<T, P>) {
		super();
		const {defaultParams} = this.config || {};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				this.setDefaultParams(defaultParams());
			} else {
				this.setDefaultParams(defaultParams);
			}
			this.setParams(this.defaultParams!);
		}
		makeObservable(this, {
			originData: observable,
			data: observable,
			params: observable,
			defaultParams: observable,
			setParams: action.bound,
			mergeParams: action.bound,
			loadData: action.bound,
			clear: action.bound,
			setData: action.bound,
			setDefaultParams: action.bound,
			setOriginData: action.bound,
		});
	}

	setParams(params: Partial<P>) {
		this.params = params;
	}

	mergeParams(params: Partial<P>) {
		this.params = {...(this.params || {}), ...params};
	}

	setData(data: Partial<T>) {
		this.data = data;
	}

	setOriginData(data: T) {
		this.originData = data;
	}

	/**
	 * Set defaultParams
	 * @param params
	 */
	setDefaultParams(params: Partial<P>) {
		this.defaultParams = params;
	}

	async loadData(params?: Partial<P> | P, config?: ObjConfig<T, P>): Promise<UseResult<T>> {
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
		} else if (this.defaultParams) {
			// 解决第一次没有设置成功
			this.mergeParams(this.defaultParams);
		}
		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T>(() => this.prepare(this.params), myConfig);
		const {success, data} = res;
		if (success) {
			const _data = data ?? ({} as T);
			// 设置原始数据
			this.setOriginData(_data);
			const {isDefaultSet, postData} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet) {
				// tslint:disable-next-line:variable-name
				let __data = _data;
				if (postData) {
					__data = postData(_data);
				}
				this.setData(__data);
			}
			if (this.config?.successCallback) {
				this.config?.successCallback(_data ?? ({} as T));
			}
		} else {
			if (this.config?.failCallback) {
				this.config?.failCallback(res);
			}
		}
		return {...res, data: this.data};
	}

	clear() {
		this.data = undefined;
	}

}
