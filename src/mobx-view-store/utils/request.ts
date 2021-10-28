import axios from 'axios';
import { ResponseBody } from '../model/response-body';

/**
 * http request
 */
export class RequestUtil {

	static get(url: string): Promise<ResponseBody> {
		return axios.get(url);
	};

	static post(url: string, data?: any): Promise<ResponseBody> {
		return axios.post(url, data);
	};

	static put(url: string, data?: any): Promise<ResponseBody> {
		return axios.put(url, data);
	};

	static del(url: string): Promise<ResponseBody> {
		return axios.delete(url);
	};
}
