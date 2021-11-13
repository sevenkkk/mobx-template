import { action, makeObservable, observable } from 'mobx';
import BaseViewStore from './base/base-view-store';
import { UseResult } from '../model/use-result';
import { FetchConfig } from '../model/fetch-config';


export interface ObjStoreConfig<P, T> {
	defaultParams?: P,
	isDefaultSet?: boolean,
	successCallback?: (data: T) => void,
	failCallback?: (res: UseResult<any>) => void
}

export class ViewObjStore<P, T> extends BaseViewStore {

	data: T | any = undefined;

	params: P | any = undefined;

	constructor(public prepare: (params: P) => Promise<any>,
				public config?: ObjStoreConfig<P, T>) {
		super();
		const {defaultParams} = this.config || {isDefaultSet: true};
		if (defaultParams) {
			this.params = {...(this.params || {}), ...defaultParams};
		}
		makeObservable(this, {
			data: observable,
			params: observable,
			loadData: action.bound,
			clear: action.bound,
		});
	}

	async loadData(params?: P, config?: FetchConfig<T>): Promise<UseResult<T>> {
		if (params) {
			this.params = {...this.params, ...params};
		}
		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T>(() => this.prepare(this.params), myConfig);
		const {success, data} = res;
		if (success) {
			const {isDefaultSet} = this.config || {isDefaultSet: true};
			if (isDefaultSet && data) {
				this.data = data;
			}
			if (this.config?.successCallback) {
				this.config?.successCallback(this.data);
			}
		} else {
			if (this.config?.failCallback) {
				this.config?.failCallback(this.data);
			}
		}
		return res;
	}

	clear() {
		this.data = undefined;
	}

}
