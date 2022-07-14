import { UseResult } from './use-result';
import { Method } from 'axios';

export interface FetchConfig<T> {
	needAuth?: boolean;
	method?: Method;
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
