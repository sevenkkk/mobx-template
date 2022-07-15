import { UseResult } from './model/use-result';
import axios, { AxiosInstance } from 'axios';

export interface TemplateConfigOptions {
	baseURL?: string;
	lang?: string;
	auth?: string;
	message401?: string;
	use401Message?: boolean;
	message403?: string;
	use403Message?: boolean;
	systemErrorMessage?: string;
	useSystemErrorMessage?: boolean;
	showErrorMessage: (data: { message: string, errorCode?: string, status?: number }) => void;
	showSuccessMessage: (message: string) => void;
	startLoading?: () => void;
	endLoading?: () => void;
	handle401?: (data: { message?: string }) => void;
	handle400?: (data: { message?: string, errorCode?: string }) => void;
	handle403?: (data: { message?: string, errorCode?: string }) => void;
	handle500?: (data: { message?: string, errorCode?: string }) => void;
	handleHttpResult?: <T>(resBody: any) => UseResult<T>;
	handleHttpErrorResult?: <T>(resBody: any, status: number) => UseResult<T>;
	handleHttpInstance?: (axios: AxiosInstance) => void;
	handlePage?: (page: number, pageSize: number) => any;
}

/**
 * Set global
 */
export class ConfigService {
	// Default global configuration
	static config: TemplateConfigOptions = {
		message401: 'Login has expired, please login again!',
		use401Message: false,
		message403: 'You do not have permission!',
		use403Message: false,
		systemErrorMessage: 'System exception, please contact the administrator!',
		useSystemErrorMessage: false,
		showErrorMessage: ({message}) => {
			if (window) {
				alert(message);
			}
		},
		showSuccessMessage: (message: string) => {
			if (window) {
				alert(message);
			}
		},
		handlePage: (page, pageSize) => {
			return {page, pageSize};
		},
		handleHttpResult: (resBody: any): UseResult<any> => {
			const {success, errorCode, errorMessage, payload, count} = resBody || {};
			return {success, errorCode, errorMessage, data: payload, total: count || 0};
		},
		handleHttpErrorResult: (resBody: any): UseResult<any> => {
			const {success, errorCode, errorMessage} = resBody || {};
			return {success, errorCode, errorMessage};
		},
	};

	static axios: AxiosInstance = axios.create();

	// 设置国际化
	static setLang(lang: string) {
		this.config.lang = lang;
	}

	// 设置auth
	static setAuth(auth?: string) {
		this.config.auth = auth;
	}

	/**
	 * Set global configuration
	 * @param config
	 */
	static setup(config?: TemplateConfigOptions): void {
		if (config) {
			this.config = {...this.config, ...config};
			if (this.config.baseURL) {
				this.axios = axios.create({baseURL: this.config.baseURL});
			}
			// 处理http回调
			if (this.config.handleHttpInstance) {
				this.config.handleHttpInstance(this.axios);
			}
		}
	}
}
