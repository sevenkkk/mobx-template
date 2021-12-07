import { action, makeObservable, observable } from 'mobx';
import BaseViewStore from './base/base-view-store';
import { UseResult } from '../model/use-result';
import { FetchConfig } from '../model/fetch-config';

type getDefaultParams<T> = () => T;

export interface ObjStoreConfig<T, P> {
	isDefaultSet?: boolean,
	successCallback?: (data: T) => void,
	failCallback?: (res: UseResult<any>) => void
	defaultParams?: Partial<P> | getDefaultParams<Partial<P>>,
}

export class ViewObjStore<T, P = Record<string, any>> extends BaseViewStore {

	data: T | any = undefined;

	params: P | any = undefined;

	constructor(public prepare: (params: P) => Promise<any>,
				public config?: ObjStoreConfig<T, P>) {
		super();
		const {defaultParams} = this.config || {};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				this.setParams(defaultParams());
			} else {
				this.setParams(defaultParams);
			}
		}
		makeObservable(this, {
			data: observable,
			params: observable,
			setParams: action.bound,
			mergeParams: action.bound,
			loadData: action.bound,
			clear: action.bound,
			setData: action.bound,
		});
	}

	setParams(params: Partial<P>) {
		this.params = params;
	}

	mergeParams(params: Partial<P>) {
		this.params = {...(this.params || {}), ...params};
	}

	setData(data: Partial<T>) {
		this.data = {...(this.data || {}), ...data};
	}

	async loadData(params?: Partial<P>, config?: FetchConfig<T>): Promise<UseResult<T>> {
		if (params) {
			if (config?.replace) {
				this.setParams(params);
			} else {
				this.mergeParams(params);
			}
		}
		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T>(() => this.prepare(this.params), myConfig);
		const {success, data} = res;
		if (success) {
			const {isDefaultSet} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet && data) {
				this.setData(data);
			}
			if (this.config?.successCallback && data) {
				this.config?.successCallback(data);
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
