import { ViewState } from '../../model/view-state';
import { action, computed, makeObservable, observable } from 'mobx';
import { UseResult } from '../../model/use-result';
import { ConfigService } from '../../config-service';
import { FetchConfig } from '../../model/fetch-config';

let timeout: any = null;

export default class BaseViewStore {

	constructor() {
		makeObservable(this, {
			state: observable,
			errorMessage: observable,
			isBusy: computed,
			setState: action.bound,
			start: action.bound,
			end: action.bound,
			error: action.bound,
			empty: action.bound,
			doFetch: action.bound,
			handleError: action.bound,
		});
	}

	state = ViewState.idle;


	setState(state: ViewState) {
		this.state = state;
	}

	get isBusy() {
		return this.state === ViewState.busy;
	}

	errorMessage = 'System Error';

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
		this.start();
		let result;
		try {
			const res = await doRequest();
			if (this.state !== ViewState.empty) {
				this.end();
			}
			this.errorMessage = '';
			result = ConfigService.config.handleHttpResult<T>(res);
		} catch (e) {
			result = this.handleError(e);
		}
		const {success, data, errorMessage, errorCode, status} = result;
		const showMessage = config?.showMessage;
		const showErrorMessage = config?.showErrorMessage;
		const showSuccessMessage = config?.showSuccessMessage;
		const myErrorMessage = config?.myErrorMessage;
		const mySuccessMessage = config?.mySuccessMessage;
		if (success) {
			if (config?.successCallback) {
				config?.successCallback(data);
			}
			if (mySuccessMessage || (showMessage && showSuccessMessage && this.isString(data))) {
				ConfigService.config.showSuccessMessage(mySuccessMessage || data);
			}
		} else {
			if (config?.failCallback) {
				config?.failCallback(result);
			}
			if (timeout != null) {
				clearTimeout(timeout);
			}
			if (myErrorMessage || (showMessage && showErrorMessage && errorMessage)) {
				timeout = setTimeout(() => {
					ConfigService.config.showErrorMessage({
						message: myErrorMessage || errorMessage || '',
						status,
						errorCode,
					});
				}, 500);
			}
		}
		return result;
	}

	isString(target: any) {
		return target && typeof target === 'string' && target.constructor === String;
	}

	/**
	 * handle error
	 * @param err
	 */
	handleError(err: any): UseResult<any> {
		this.error();
		const response = err.response;
		const res = ConfigService.config.handleHttpErrorResult<any>(response?.data);
		const {errorMessage: message, errorCode} = res;
		if (response) {
			if (response.status === 400 && ConfigService.config.handle400) {
				ConfigService.config.handle400({message, errorCode});
			}
			if (response.status === 403 && ConfigService.config.handle403) {
				ConfigService.config.handle403({message, errorCode});
			}
			if (response.status === 401 && ConfigService?.config?.handle401) {
				ConfigService?.config?.handle401({message});
			}
		}
		this.errorMessage = res?.errorMessage || ConfigService.config?.systemErrorMessage || '';
		return {...res, status: response.status || -100};
	}

}
