import { ViewBaseBodyStore } from './base/view-base-body-store';
import { action, makeObservable, observable, override } from 'mobx';
import { UseResult } from '../model/use-result';
import { FetchConfig } from '../model/fetch-config';

type getDefaultBody<T> = () => T;

export interface SubmitStoreConfig<P, T> {
	isDefaultSet?: boolean,
	successCallback?: (data: T) => void,
	failCallback?: (res: UseResult<any>) => void
	defaultBody?: Partial<P> | getDefaultBody<Partial<P>>,
}

export class ViewSubmitStore<P = Record<string, any>, T = string> extends ViewBaseBodyStore<P> {

	data: T | any = undefined;

	constructor(public prepare: (body: P) => Promise<any>,
				public config?: SubmitStoreConfig<P, T>) {
		super();
		const {defaultBody} = this.config || {};
		if (defaultBody) {
			if (typeof defaultBody === 'function') {
				this.setBody(defaultBody());
			} else {
				this.setBody(defaultBody);
			}
		}
		makeObservable(this, {
			data: observable,
			submit: action.bound,
			setData: action.bound,
			clear: override,
		});
	}

	async submit(body?: Partial<P>, config?: FetchConfig<T>): Promise<UseResult<T>> {
		if (body) {
			if (config?.replace) {
				this.setBody(body);
			} else {
				this.mergeBody(body);
			}
		}
		const myConfig = {showMessage: true, showSuccessMessage: true, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T>(() => this.prepare(this.body), myConfig);
		const {success, data} = res;
		if (success) {
			const {isDefaultSet} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet && data) {
				this.setData(data);
			}
			if (this.config?.successCallback) {
				this.config?.successCallback(this.data);
			}
		} else {
			if (this.config?.failCallback) {
				this.config?.failCallback(this.data);
			}
		}
		return {...res, data: this.data};
	}

	clear() {
		super.clear();
		this.setData(undefined);
	}

	setData(data: any) {
		this.data = data;
	}

}
