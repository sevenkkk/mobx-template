import { action, observable } from 'mobx';
import { ViewBaseBodyStore } from './base/view-base-body-store';

/**
 * 获取数据
 */
export abstract class ViewObjectStore<P, T> extends ViewBaseBodyStore<P> {

	@observable
	data: T | any = {};

	protected constructor() {
		super();
		this.initialize();
	}
	@observable
	isDefaultSet = true;

	/**
	 * 获取数据
	 * @param body
	 */
	@action.bound
	async loadData(body?: P): Promise<{
		success: boolean
		data: T
	}> {
		if (body) {
			this.body = {...this.body, ...body};
		}
		const success = await this.doFetch(async () => {
			const res = await this.prepare();
			if (this.isDefaultSet) {
				this.data = res.payload;
			}

			this.onLoadComplete(res.payload);
		});
		return {success, data: this.data};
	}

	/**
	 * 清空数据
	 */
	@action.bound
	clear() {
		this.data = {};
	}

	/**
	 * 获取数据成功
	 * @param data
	 */
	onLoadComplete(data: T) {
	}

}

/**
 * 获取数据
 */
export abstract class ViewStringStore<P> extends ViewBaseBodyStore<P> {

	@observable
	data: string = '';

	/**
	 * 获取数据
	 * @param body
	 */
	@action.bound
	async loadData(body?: P): Promise<{
		success: boolean
		data: string
	}> {
		if (body) {
			this.body = {...this.body, ...body};
		}
		const success = await this.doFetch(async () => {
			const res = await this.prepare();
			this.data = res.payload;
			this.onLoadComplete(this.data);
		});
		return {success, data: this.data};
	}

	/**
	 * 清空数据
	 */
	@action.bound
	clear() {
		this.data = '';
	}

	/**
	 * 获取数据成功
	 * @param data
	 */
	onLoadComplete(data: string) {
	}

}
