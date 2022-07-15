import { BaseViewStore } from './base-view-store';
import { action, makeObservable, observable } from 'mobx';

export class ViewBaseBodyStore<P> extends BaseViewStore {

	protected constructor() {
		super();
		makeObservable(this, {
			body: observable,
			setBody: action.bound,
			mergeBody: action.bound,
			clear: action.bound,
		});
	}

	body: P | undefined = undefined;

	setBody(value: P | Partial<P>) {
		// @ts-ignore
		this.body = value;
	}

	mergeBody(value: Partial<P>) {
		// @ts-ignore
		this.body = {...this.body || {}, ...value};
	}

	clear() {
		this.body = undefined;
	}
}
