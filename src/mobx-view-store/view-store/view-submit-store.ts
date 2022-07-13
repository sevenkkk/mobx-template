import { ViewBaseBodyStore } from './base/view-base-body-store';
import { action, makeObservable, observable, override } from 'mobx';
import { UseResult } from '../model/use-result';
import { FetchConfig } from '../model/fetch-config';
import { CommonUtilsService } from '../utils/common-utils.service';

type getDefaultBody<T> = () => T;

export interface SubmitStoreConfig<P, T> {
	isDefaultSet?: boolean,
	successCallback?: (data: T) => void,
	failCallback?: (res: UseResult<any>) => void
	defaultBody?: Partial<P> | getDefaultBody<Partial<P>>,
	postData?: (data: any) => T,
}

export class ViewSubmitStore<P = Record<string, any>, T = string> extends ViewBaseBodyStore<P> {

	data: T | Partial<T> | undefined = undefined;

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
			mergeData: action.bound,
			clear: override,
		});
	}

	async submit(body?: Partial<P> | P, config?: FetchConfig<T>): Promise<UseResult<T>> {
		if (body) {
			if (config?.replace || !CommonUtilsService.isObject(body)) {
				this.setBody(body);
			} else {
				this.mergeBody(body);
			}
		}
		const myConfig = {
			showMessage: true,
			showSuccessMessage: true,
			showErrorMessage: true,
			loading: true,
			...(this.config || {}),
			...(config || {}),
		};
		const res = await this.doFetch<T>(() => this.prepare(this.body as P), myConfig);
		const {success, data} = res;
		if (success) {
			const {isDefaultSet, postData} = {isDefaultSet: true, ...(this.config || {})};
			if (isDefaultSet && data !== undefined) {
				let _data = data;
				if (postData) {
					_data = postData(data);
				}
				this.setData(_data);
			}
			if (myConfig.successCallback) {
				myConfig.successCallback(this.data! as T);
			}
		} else {
			if (myConfig.failCallback) {
				myConfig.failCallback(res);
			}
		}
		return {...res, data: this.data as T};
	}

	clear() {
		super.clear();
		this.setData(undefined);
	}

	setData(data?: T) {
		this.data = data;
	}

	mergeData(data: Partial<T>) {
		this.data = {...this.data || {}, ...data};
	}
}
