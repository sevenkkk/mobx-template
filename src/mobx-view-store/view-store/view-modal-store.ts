import { PageActionType } from '../model/page-action-type.model';
import { action, computed, makeObservable, observable } from 'mobx';

export interface ModalStoreConfig {
	onOpen?: (data?: Record<string, any>) => void;
	onClose?: () => void
}

export class ViewModalStore {

	onOpen?: (data?: Record<string, any>) => void;

	onClose?: () => void;

	constructor(public config?: ModalStoreConfig) {
		this.onOpen = this.config?.onOpen;
		this.onClose = this.config?.onClose;

		makeObservable(this, {
			showModal: observable,
			data: observable,
			actionType: observable,
			openModal: action.bound,
			closeModal: action.bound,
			setData: action.bound,
			isUpdate: computed,
		});
	}

	showModal = false;

	actionType = PageActionType.ADD;

	data?: Record<string, any> = undefined;

	openModal(data?: Record<string, any>, actionType: PageActionType = PageActionType.ADD) {
		this.actionType = actionType;
		this.setData();
		this.showModal = true;
		if (this.onOpen) {
			this.onOpen(data);
		}
	}

	setData(data?: Record<string, any>) {
		this.data = data;
	}

	closeModal() {
		this.showModal = false;
		if (this.onClose) {
			this.onClose();
		}
	}

	get isUpdate(): boolean {
		return this.actionType === PageActionType.UPDATE;
	};

}
