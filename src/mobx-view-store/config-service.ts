import { UseResult } from './model/use-result';

export interface ConfigOptions {
	message401?: string;
	message403?: string;
	systemErrorMessage?: string;
	showErrorMessage: (data: { message: string, errorCode?: string, status?: number }) => void;
	showSuccessMessage: (message: string) => void;
	handle401?: (data: { message?: string }) => void;
	handle400?: (data: { message?: string, errorCode?: string }) => void;
	handle403?: (data: { message?: string, errorCode?: string }) => void;
	handle500?: (data: { message?: string, errorCode?: string }) => void;
	handleHttpResult: <T>(resBody: any) => UseResult<T>;
	handleHttpErrorResult: <T>(resBody: any) => UseResult<T>;
}

/**
 * Set global
 */
export class ConfigService {
	// Default global configuration
	static config: ConfigOptions = {
		message401: 'Login has expired, please login again!',
		message403: 'You do not have permission!',
		systemErrorMessage: 'System exception, please contact the administrator!',
		showErrorMessage: ({message}) => {
			alert(message);
		},
		showSuccessMessage: (message: string) => {
			alert(message);
		},
		handleHttpResult: (resBody: any) => {
			return {success: true, data: resBody};
		},
		handleHttpErrorResult: (resBody: any) => {
			return {success: false, data: resBody};
		},
	};

	/**
	 * Set global configuration
	 * @param config
	 */
	static setup(config?: ConfigOptions): void {
		if (config) {
			this.config = {...this.config, ...config};
		}
	}
}
