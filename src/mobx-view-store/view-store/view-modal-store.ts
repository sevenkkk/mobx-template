import { action, computed, observable } from 'mobx';
import { PageActionType } from '../model/page-action-type.model';

export abstract class ViewModalStore<P> {
	@observable
	showModal = false;

	@observable
	actionType = PageActionType.ADD; // 页面modal操作类型

	/**
	 * 打开modal
	 * @param actionType 页面操作类型
	 */
	@action.bound
	openModal(actionType: PageActionType = PageActionType.ADD) {
		this.actionType = actionType;
		this.showModal = true;
		return (data?: P) => this.loadModalData(data);
	}


	/**
	 * 关闭modal
	 */
	@action.bound
	closeModal() {
		this.showModal = false;
		this.clearModal();
	}

	/**
	 * 是否更新
	 */
	@computed
	get isUpdate(): boolean {
		return this.actionType === PageActionType.UPDATE;
	};

	/**
	 * 获取modal标题
	 */
	@computed
	get actionText(): string {
		return this.getTitle();
	};

	/**
	 * 获取modal数据
	 * @param data
	 */
	protected abstract loadModalData(data?: P): void

	/**
	 * 清空modal数据
	 */
	protected abstract clearModal(): void;

	/**
	 * modal 标题
	 */
	protected abstract getTitle(): string;
}
