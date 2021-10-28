import { ResponseData } from '../../model/response-body';

export interface ISubmit<T, R> {

	/**
	 * 提交事件
	 */
	handleSubmit(body: T, ...arr: any[]): Promise<ResponseData<R>>;
}
