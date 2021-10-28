import { action, observable } from 'mobx';
import BaseViewStore from './base-view-store';
import { ResponseBody } from '../../model/response-body';

export abstract class ViewBaseBodyListStore<P> extends BaseViewStore {

	// 请求体
	@observable
	body: P[] = [];

	public constructor() {
		super();
		this.initialize();
	}

	/**
	 * 初始化方法
	 */
	@action.bound
	// tslint:disable-next-line:no-empty
	initialize() {
	}

	/**
	 * 设置请求体
	 * @param value
	 */
	@action.bound
	setBody(value: P[]) {
		this.body = [...this.body, ...value];
	}

	abstract prepare(): Promise<ResponseBody>;


	clear() {
		this.body = [];
	}
}
