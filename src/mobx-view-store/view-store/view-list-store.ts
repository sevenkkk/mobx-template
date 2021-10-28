import { action, observable } from 'mobx';
import ViewBaseListStore from './base/view-base-list-store';
import { ResponseBody } from '../model/response-body';

export default abstract class ViewListStore<P, T> extends ViewBaseListStore<P, T> {

	protected constructor() {
		super();
		this.initialize();
	}

	@observable
	isDefaultSet = true;

	/**
	 * api请求
	 */
	abstract prepare(): Promise<ResponseBody>;

	/**
	 * 初始化方法
	 */
	@action.bound
	initialize() {
		this.params = {};
	}


	/**
	 * 加载数据
	 */
	@action.bound
	loadData(params?: P): Promise<boolean> {
		if (params) {
			this.params = {...this.params, ...params};
		}
		return this.doFetch(async () => {
			const res = await this.prepare();
			if(this.isDefaultSet){
				this.list = res.payload;
			}
			this.onLoadComplete(res.payload);
		});
	}

}
