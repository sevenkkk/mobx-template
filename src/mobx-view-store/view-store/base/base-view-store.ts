import { computed, observable } from 'mobx';
import { ViewState } from '../../model/view-state';

export default class BaseViewStore {

	@observable
	private _state = ViewState.idle;

	@computed
	get state() {
		return this._state;
	}

	set state(state: ViewState) {
		this._state = state;
	}

	@computed
	get isBusy() {
		return this.state === ViewState.busy;
	}

	private _errorMessage = '';

	get errorMessage() {
		return this._errorMessage || '网络请求发送失败';
	}

	start() {
		this.state = ViewState.busy;
	}

	end() {
		this.state = ViewState.idle;
	}

	error() {
		this.state = ViewState.error;
	}

	empty() {
		this.state = ViewState.empty;
	}

	/**
	 * 请求封装
	 * @param doRequest  请求
	 * @param errorCallback  失败回调
	 */
	async doFetch(doRequest: () => Promise<void>, errorCallback?: () => void): Promise<boolean> {
		this.start();
		this._errorMessage = '';
		try {
			await doRequest();
			if (this.state !== ViewState.empty) {
				this.end();
			}
			return true;
		} catch (e) {
			if (errorCallback) {
				errorCallback();
			}
			this.handleError(e);
			return false;
		}
	}

	/**
	 * 异常处理
	 * @param err 异常
	 */
	handleError(err: any) {
		this.error();
		const response = err.response;
		if (response) {
			if (response.status === 400) {
				this._errorMessage = response.data.errorMessage || '';
			}
		}
	}

}
