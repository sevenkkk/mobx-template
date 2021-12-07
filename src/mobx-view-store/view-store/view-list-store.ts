import ViewBaseListStore from './base/view-base-list-store';
import { UseResult } from '../model/use-result';
import { action, makeObservable, override } from 'mobx';
import { FetchConfig } from '../model/fetch-config';

type getDefaultParams<T> = () => T;

export interface ListStoreConfig<T, P> {
	isDefaultSet?: boolean,
	successCallback?: (data: T[], total?: number) => void,
	failCallback?: (res: UseResult<any>) => void
	defaultParams?: Partial<P> | getDefaultParams<Partial<P>>,
}

export class ViewListStore<T, P = Record<string, any>> extends ViewBaseListStore<T, P> {

	constructor(public prepare: (params: P) => Promise<any>,
				public config?: ListStoreConfig<T, P>) {
		super();
		const {defaultParams} = this.config || {isDefaultSet: true};
		if (defaultParams) {
			if (typeof defaultParams === 'function') {
				this.setParams(defaultParams());
			} else {
				this.setParams(defaultParams);
			}
		}
		makeObservable(this, {loadData: action.bound, clear: override});
	}

	async loadData(params?: Partial<P>, config?: FetchConfig<T[]>): Promise<UseResult<T[]>> {
		if (params) {
			if (config?.replace) {
				this.setParams(params);
			} else {
				this.mergeParams(params);
			}
		}
		const myConfig = {showMessage: true, showSuccessMessage: false, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T[]>(() => this.prepare(this.params), myConfig);
		const {success, data} = res;
		if (success) {
			const {isDefaultSet} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet && data) {
				this.setList(data);
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
