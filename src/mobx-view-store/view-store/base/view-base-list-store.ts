import { action, computed, observable } from 'mobx';
import BaseViewStore from './base-view-store';

export default abstract class ViewBaseListStore<P, T> extends BaseViewStore {

	@observable list: T[] = [];

	@observable
	params: P | any;

	@observable
	index: number = -1;

	@computed
	get active(): T | null {
		return this.list.length > this.index ? this.list[this.index] : null;
	}

	@action.bound
	setIndex(index: number) {
		this.index = index;
	}

	/**
	 * 判断列表是否存在数据
	 */
	@computed
	get hasData() {
		return this.list && this.list.length > 0;
	}

	/**
	 * 设置参数
	 * @param obj
	 */
	@action.bound
	setParams(obj: P) {
		this.params = {...this.params, ...obj};
	}

	/**
	 * 清空数据
	 */
	@action.bound
	clear() {
		this.list = [];
		this.end();
	}

	/**
	 * 加载数据完成
	 * @param list
	 */
	onLoadComplete(list: T[]) {
		if (list.length === 0) {
			this.empty();
		}
	}

}
