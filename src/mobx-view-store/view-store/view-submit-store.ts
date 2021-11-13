import { ViewBaseBodyStore } from './base/view-base-body-store';
import { action, makeObservable, observable, override } from 'mobx';
import { UseResult } from '../model/use-result';
import { FetchConfig } from '../model/fetch-config';

export interface SubmitStoreConfig<P, T> {
	defaultBody?: P,
	isDefaultSet?: boolean,
	successCallback?: (data: T) => void,
	failCallback?: (res: UseResult<any>) => void
}

export class ViewSubmitStore<P, T> extends ViewBaseBodyStore<P> {

	data: T | any = undefined;

	constructor(public prepare: (body: P) => Promise<any>,
				public config?: SubmitStoreConfig<P, T>) {
		super();
		const {defaultBody} = this.config || {isDefaultSet: true};
		if (defaultBody) {
			this.setBody({...(this.body || {}), ...defaultBody});
		}
		makeObservable(this, {
			data: observable,
			submit: action.bound,
			setData: action.bound,
			clear: override,
		});
	}

	async submit(body?: P, config?: FetchConfig<T>): Promise<UseResult<T>> {
		if (body) {
			this.setBody({...this.body, ...body});
		}

		const myConfig = {showMessage: true, showSuccessMessage: true, showErrorMessage: true, ...(config || {})};
		const res = await this.doFetch<T>(() => this.prepare(this.body), myConfig);
		const {success, data} = res;
		if (success) {
			this.setData(data);
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
		super.clear();
		this.setData(undefined);
	}

	setData(data: any) {
		this.data = data;
	}

}
