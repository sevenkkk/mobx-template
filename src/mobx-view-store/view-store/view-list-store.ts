import ViewBaseListStore from './base/view-base-list-store';
import { UseResult } from '../model/use-result';
import { action, makeObservable, override } from 'mobx';
import { FetchConfig } from '../model/fetch-config';

export interface ListStoreConfig<P, T> {
	defaultParams?: P,
	isDefaultSet?: boolean,
	successCallback?: (data: T[]) => void,
	failCallback?: (res: UseResult<any>) => void
}

export class ViewListStore<P, T> extends ViewBaseListStore<P, T> {

	constructor(public prepare: (params: P) => Promise<any>, public config?: ListStoreConfig<P, T>) {
		super();
		const {defaultParams} = this.config || {isDefaultSet: true};
		if (defaultParams) {
			this.params = defaultParams;
		}
		makeObservable(this, {loadData: action.bound, clear: override});
	}

	async loadData(params?: P, config?: FetchConfig<T[]>): Promise<UseResult<T[]>> {
		if (params) {
			this.setParams(params);
		}

		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T[]>(() => this.prepare(this.params), myConfig);
		const {success, data} = res;
		if (success) {
			const {isDefaultSet} = this.config || {isDefaultSet: true};
			if (isDefaultSet && data) {
				this.list = data;
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
