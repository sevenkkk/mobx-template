import { UseResult } from './use-result';

export interface FetchConfig<T> {
	replace?: boolean;
	showMessage?: boolean;
	showErrorMessage?: boolean;
	showSuccessMessage?: boolean;
	myErrorMessage?: string;
	mySuccessMessage?: string;
	successCallback?: (data: T) => void;
	failCallback?: (res: UseResult<any>) => void;
}
