import { UseResult } from './use-result';

export interface FetchConfig<T> {
	status?: boolean;
	loading?: boolean;
	replace?: boolean;
	showMessage?: boolean;
	showErrorMessage?: boolean;
	showSuccessMessage?: boolean;
	myErrorMessage?: string;
	mySuccessMessage?: string;
	successCallback?: (data: T, total?: number) => void;
	failCallback?: (res: UseResult<any>) => void;
}
