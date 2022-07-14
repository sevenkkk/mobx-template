import { ViewState } from '../../model/view-state';
import { action, computed, makeObservable, observable } from 'mobx';
import { UseResult } from '../../model/use-result';
import { ConfigService } from '../../config-service';
import { FetchConfig } from '../../model/fetch-config';
import { CommonUtilsService } from '../../utils/common-utils.service';

let timeout: any = null;

export class BaseViewStore {

	constructor() {
		makeObservable(this, {
			state: observable,
			errorMessage: observable,
			isBusy: computed,
			isEmpty: computed,
			setState: action.bound,
			start: action.bound,
			end: action.bound,
			error: action.bound,
			empty: action.bound,
			doFetch: action.bound,
			setErrorMessage: action.bound,
			handleError: action.bound,
		});
	}

	state = ViewState.idle;

	errorMessage = '';

	setState(state: ViewState) {
		this.state = state;
	}

	get isBusy() {
		return this.state === ViewState.busy;
	}

	get isEmpty() {
		return this.state === ViewState.empty;
	}

	setErrorMessage(errorMessage: string) {
		this.errorMessage = errorMessage;
	}

	start() {
		this.setState(ViewState.busy);
	}

	end() {
		this.setState(ViewState.idle);
	}

	error() {
		this.setState(ViewState.error);
	}

	empty() {
		this.setState(ViewState.empty);
	}


	/**
	 * doFetch
	 * @param doRequest
	 * @param config
	 */
	async doFetch<T>(doRequest: () => Promise<any>, config?: FetchConfig<T>): Promise<UseResult<T>> {
		if (config?.status !== false) {
			this.start();
		}
		if(config?.loading && ConfigService.config?.startLoading){
			ConfigService.config?.startLoading();
		}
		let result;
		try {
			const res = await doRequest();
			if (config?.status !== false) {
				if (this.state !== ViewState.empty) {
					this.end();
				}
			}
			this.setErrorMessage('');
			result = ConfigService.config.handleHttpResult!<T>(res);
			if(config?.loading && ConfigService.config?.endLoading){
				ConfigService.config.endLoading();
			}
		} catch (e) {
			result = this.handleError(e, config?.status);
			if(config?.loading && ConfigService.config?.endLoading){
				ConfigService.config.endLoading();
			}
		}
		const {success, data, errorMessage, errorCode, status} = result;
		const showMessage = config?.showMessage;
		const showErrorMessage = config?.showErrorMessage;
		const showSuccessMessage = config?.showSuccessMessage;
		const myErrorMessage = config?.myErrorMessage;
		const mySuccessMessage = config?.mySuccessMessage;
		if (success) {
			if (mySuccessMessage || (showMessage && showSuccessMessage && CommonUtilsService.isString(data))) {
				ConfigService.config.showSuccessMessage(mySuccessMessage || data);
			}
		} else {
			const handleShowErrorMessage = (isShow: boolean, message?: string) => {
				if (timeout != null) {
					clearTimeout(timeout);
				}

				if (message) {
					this.setErrorMessage(message);
				}

				if (isShow && message) {
					timeout = setTimeout(() => {
						ConfigService.config.showErrorMessage({
							message,
							status,
							errorCode,
						});
					}, 500);
				}
			};

			if (status === 401 || status === 403) {
				handleShowErrorMessage(true, errorMessage);
			} else {
				const eMessage = myErrorMessage || errorMessage;
				handleShowErrorMessage(!!(showMessage && showErrorMessage), eMessage);
			}

		}
		return result;
	}

	/**
	 * handle error
	 * @param err
	 * @param status 是否有状态
	 */
	handleError(err: any, status?: boolean): UseResult<any> {
		if (status !== false) {
			this.error();
		}
		const response = err.response;
		if (response) {
			const res = ConfigService.config.handleHttpErrorResult!(response.data, response.status);
			const {errorMessage: message, errorCode} = res;
			if (response.status === 400 && ConfigService.config.handle400) {
				ConfigService.config.handle400({message, errorCode});
			}
			if (response.status === 403 && ConfigService.config.handle403) {
				ConfigService.config.handle403({message, errorCode});
			}
			if (response.status === 401 && ConfigService?.config?.handle401) {
				ConfigService?.config?.handle401({message});
			}
			if (response.status === 500 && ConfigService?.config?.handle500) {
				ConfigService?.config?.handle500({message});
			}
			let useErrorMessage = message;
			if (response.status === 500) {
				useErrorMessage = ConfigService?.config.useSystemErrorMessage ? ConfigService?.config.systemErrorMessage : message;
			} else if (response.status === 401) {
				useErrorMessage = ConfigService.config.use401Message ? ConfigService.config.message401 : message;
			} else if (response.status === 403) {
				useErrorMessage = ConfigService.config.use403Message ? ConfigService.config.message403 : message;
			}
			return {...res, status: response.status, errorMessage: useErrorMessage};
		}
		return {
			success: false,
			status: -100,
			errorCode: '0000',
			errorMessage: 'Internal error, check whether the code is correct',
		};
	}

}
