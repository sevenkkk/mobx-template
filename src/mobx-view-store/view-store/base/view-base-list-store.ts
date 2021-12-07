import BaseViewStore from './base-view-store';
import { action, computed, makeObservable, observable } from 'mobx';

export default class ViewBaseListStore<T, P> extends BaseViewStore {

	constructor() {
		super();
		makeObservable(this, {
			list: observable,
			params: observable,
			index: observable,
			active: computed,
			setIndex: action.bound,
			hasData: computed,
			setParams: action.bound,
			mergeParams: action.bound,
			setList: action.bound,
			clear: action.bound,
			onLoadComplete: action.bound,
		});
	}

	// tslint:disable-next-line:no-empty
	reload: (params?: P) => void = () => {
	};

	list: T[] = [];

	params: P | any = undefined;

	index: number = -1;

	get active(): T | null {
		return this.list.length > this.index ? this.list[this.index] : null;
	}

	setIndex(index: number) {
		this.index = index;
	}

	setList(list: T[]) {
		this.list = list;
	}

	/**
	 * Is it empty
	 */
	get hasData() {
		return this.list && this.list.length > 0;
	}

	/**
	 * merge parameters
	 * @param params
	 */
	mergeParams(params: Partial<P>) {
		this.params = {...(this.params || {}), ...params};
	}

	/**
	 * Set parameters
	 * @param params
	 */
	setParams(params: Partial<P>) {
		this.params = params;
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
