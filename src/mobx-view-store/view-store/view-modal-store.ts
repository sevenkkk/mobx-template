import { PageActionType } from '../model/page-action-type.model';
import { action, makeObservable, observable } from 'mobx';

export interface ModalStoreConfig {
	onOpen?: (data?: Record<string, any>) => void;
	onClose?: () => void
}

export class ViewModalStore<T = Record<string, any> | string> {

	onOpen?: (data?: Record<string, any>) => void;

	onClose?: () => void;

	constructor(public config?: ModalStoreConfig) {
		this.onOpen = this.config?.onOpen;
		this.onClose = this.config?.onClose;

		makeObservable(this, {
			visible: observable,
			data: observable,
			actionType: observable,
			openModal: action.bound,
			closeModal: action.bound,
			setData: action.bound,
			setVisible: action.bound,
		});
	}

	visible = false;

	actionType = PageActionType.ADD;

	data?: T = undefined;

	openModal(data?: T) {
		this.setData(data);
		this.setVisible(true);
		if (this.onOpen) {
			this.onOpen(data);
		}
	}

	setVisible(visible: boolean) {
		this.visible = visible;
	}

	setData(data?: T) {
		this.data = data;
	}

	closeModal() {
		this.setVisible(false);
		this.setData(undefined);
		if (this.onClose) {
			this.onClose();
		}
	}

}
