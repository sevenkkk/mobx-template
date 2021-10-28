import { action, computed, observable } from 'mobx';
import ViewBaseListStore from './base/view-base-list-store';
import { ResponseBody } from '../model/response-body';
import { PageView } from '../model/page';

export default abstract class ViewPageListStore<P, T> extends ViewBaseListStore<P, T> {

	@observable page = 1;
	@observable pageSize = 10;

	@observable
	count: number = 0;

	@observable
	isDefaultSet = true;

	protected constructor() {
		super();
		this.initialize();
	}

	/**
	 * api请求
	 */
	abstract prepare(): Promise<ResponseBody>;

	/**
	 * 初始化方法
	 */
	@action.bound
	initialize() {
		this.params = {
			page: this.page,
			pageSize: this.pageSize,
		};
	}

	/**
	 * 获取商品分页信息
	 */
	@computed
	get pages(): PageView {
		return {count: this.count, page: this.page, pageSize: this.pageSize, loadDataPage: this.loadDataPage};
	}

	/**
	 * 加载数据
	 * @param params
	 * @param page
	 * @param pageSize
	 */
	@action.bound
	loadData(params?: P, page: number = this.page, pageSize: number = this.params.pageSize): Promise<boolean> {
		if (params) {
			this.params = {...this.params, ...params};
		}
		return this._loadData(page, pageSize);
	}

	/**
	 * 加载数据
	 * @param page
	 * @param pageSize
	 */
	@action.bound
	loadDataPage(page: number = this.page, pageSize: number = this.params.pageSize): Promise<boolean> {
		return this._loadData(page, pageSize);
	}

	/**
	 * 加载分页数据
	 * @param page
	 * @param pageSize
	 * @private
	 */
	private _loadData(page: number, pageSize: number): Promise<boolean> {
		if (this.page !== page) {
			this.page = page;
		}
		if (this.pageSize !== pageSize) {
			this.pageSize = pageSize;
		}
		this.params = {...this.params, page, pageSize};
		return this.doFetch(async () => {
			const res = await this.prepare();
			if (this.isDefaultSet) {
				this.list = res.payload;
				this.count = res.count;
			}
			this.count = res.count;
			this.onLoadComplete(res.payload);
		});
	}

}
