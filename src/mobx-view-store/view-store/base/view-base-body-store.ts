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

	body: P | any = undefined;

	setBody(value: Partial<P>) {
		this.body = value;
	}

	mergeBody(value: Partial<P>) {
		this.body = {...this.body || {}, ...value};
	}

	clear() {
		this.body = undefined;
	}
}
