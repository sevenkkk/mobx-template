import BaseViewStore from './base-view-store';
import { action, makeObservable, observable } from 'mobx';

export class ViewBaseBodyStore<P> extends BaseViewStore {

	protected constructor() {
		super();
		makeObservable(this, {
			body: observable,
			setBody: action.bound,
			clear: action.bound,
		});
	}

	body: P | any = undefined;

	setBody(value: P) {
		this.body = {...this.body || {}, ...value};
	}

	clear() {
		this.body = undefined;
	}
}
