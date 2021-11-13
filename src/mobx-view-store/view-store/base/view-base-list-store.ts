import BaseViewStore from './base-view-store';
import { action, computed, makeObservable, observable } from 'mobx';

export default class ViewBaseListStore<P, T> extends BaseViewStore {
	constructor() {
		super();
		makeObservable(this, {
			list: observable,
			params: observable,
			index: observable,
			active: computed,
			setIndex: action.bound,
			hasData: action.bound,
			setParams: action.bound,
			clear: action.bound,
			onLoadComplete: action.bound,
		});
	}

	list: T[] = [];

	params: P | any = undefined;

	index: number = -1;

	get active(): T | null {
		return this.list.length > this.index ? this.list[this.index] : null;
	}

	setIndex(index: number) {
		this.index = index;
	}

	/**
	 * Is it empty
	 */
	get hasData() {
		return this.list && this.list.length > 0;
	}

	/**
	 * Set parameters
	 * @param obj
	 */
	setParams(obj: P) {
		this.params = {...this.params, ...obj};
	}

	/**
	 * Clear data
	 */
	clear() {
		this.list = [];
		this.end();
	}

	/**
	 * Loading data complete
	 * @param list
	 */
	onLoadComplete(list: T[]) {
		if (list.length === 0) {
			this.empty();
		}
	}

}
