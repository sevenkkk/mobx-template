import { BaseViewStore } from './base-view-store';
import { action, computed, makeObservable, observable } from 'mobx';

export default class ViewBaseListStore<T, P> extends BaseViewStore {

	constructor() {
		super();
		makeObservable(this, {
			originList: observable,
			list: observable,
			params: observable,
			defaultParams: observable,
			index: observable,
			active: computed,
			setIndex: action.bound,
			hasData: computed,
			setParams: action.bound,
			mergeParams: action.bound,
			setList: action.bound,
			setDefaultParams: action.bound,
			clear: action.bound,
			onLoadComplete: action.bound,
		});
	}

	// 原始数据
	originList: T[] = [];

	// 可能被处理过的数据，如果没有处理跟rawList值一样
	list: T[] = [];

	params: P | undefined = undefined;

	defaultParams: P | undefined = undefined;

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

	setOriginList(data: T[]) {
		this.originList = data;
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
		// @ts-ignore
		this.params = {...(this.params || {}), ...params};
	}

	/**
	 * Set parameters
	 * @param params
	 */
	setParams(params: Partial<P>) {
		// @ts-ignore
		this.params = params;
	}

	/**
	 * Set defaultParams
	 * @param params
	 */
	setDefaultParams(params: P | Partial<P>) {
		// @ts-ignore
		this.defaultParams = params;
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
