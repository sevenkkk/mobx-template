import { BaseViewStore } from './base-view-store';
import { action, makeObservable, observable } from 'mobx';

export class ViewBaseFetchStore<P, R> extends BaseViewStore {

	protected constructor() {
		super();
		makeObservable(this, {
			data: observable,
			params: observable,
			setParams: action.bound,
			mergeParams: action.bound,
			setData: action.bound,
			mergeData: action.bound,
			setOriginData: action.bound,
			clear: action.bound,
		});
	}

	// 请求参数
	params: P | undefined | Partial<P> = undefined;

	// 返回值
	data: R | undefined = undefined;

	// 原始数据返回值
	originData: R | undefined = undefined;

	// 设置参数
	setParams(params: Partial<P>) {
		this.params = params;
	}

	// 合并修改参数
	mergeParams(params: Partial<P>) {
		this.params = {...this.params || {}, ...params};
	}

	// 修改返回值
	setData(data: R) {
		this.data = data;
	}

	// 合并修改返回值
	mergeData(data: Partial<R>) {
		this.data = {...(this.data || {}), ...data} as R;
	}

	// 设置原始值
	setOriginData(data: R) {
		this.originData = data;
	}

	// 清空对象
	clear() {
		this.data = undefined;
		this.originData = undefined;
		this.params = undefined;
	}
}
