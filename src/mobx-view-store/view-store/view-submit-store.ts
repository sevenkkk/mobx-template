import { action, observable } from 'mobx';
import { ViewBaseBodyStore } from './base/view-base-body-store';
import { ViewBaseBodyListStore } from './base/view-base-body-list-store';

/**
 * 提交请求
 */
export abstract class ViewSubmitStore<P> extends ViewBaseBodyStore<P> {

	@action.bound
	async submit(body?: P): Promise<{ success: boolean }> {
		if (body) {
			this.body = {...this.body, ...body};
		}

		const success = await this.doFetch(async () => {
			const res = await this.prepare();
			this.onLoadComplete(res.payload);
		});
		return {success};
	}

	@action.bound
	clear() {
		super.clear();
	}

	onLoadComplete(mgs?: string) {
	}

}

/**
 * 提交请求（带返回体）
 */
// tslint:disable-next-line:max-classes-per-file
export abstract class ViewSubmitResultStore<P, T> extends ViewBaseBodyStore<P> {

	@observable
	data: T | any;

	@action.bound
	async submit(body?: P): Promise<{
		success: boolean
		data: T
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

	@action.bound
	clear() {
		super.clear();
		this.data = undefined;
	}

	onLoadComplete(data: T) {
	}

}

/**
 * 提交请求(传值数组)
 */
// tslint:disable-next-line:max-classes-per-file
export abstract class ViewSubmitListStore<P> extends ViewBaseBodyListStore<P> {

	@action.bound
	async submit(body?: P[]): Promise<{ success: boolean }> {
		if (body) {
			this.body = body;
		}
		const success = await this.doFetch(async () => {
			const res = await this.prepare();
			this.onLoadComplete(res.payload);
		});
		return {success};
	}

	@action.bound
	clear() {
		super.clear();
	}

	onLoadComplete(mgs?: string) {
	}

}
