import { AxiosRequestConfig, Method } from 'axios';
import { ConfigService } from '../config-service';

export type MyAxiosRequestConfig = AxiosRequestConfig & {
	needAuth?: boolean
}

export function getRequest(method: Method, url: string, params: any, config?: MyAxiosRequestConfig) {
	switch (method) {
		case 'POST':
		case 'post':
			return fetchPost(url, params, config);
		case 'PUT':
		case 'put':
			return fetchPut(url, params, config);
		case 'DELETE':
		case 'delete':
			return fetchDel(url, config);
		default:
			return fetchGet(url, config);
	}
}

const setCommonHeader = (config?: MyAxiosRequestConfig) => {
	if (config?.needAuth) {
		config = {...config, headers: {...config.headers, ['need-auth']: true}};
	}
	return config;
};


export function fetchGet(url: string, config?: MyAxiosRequestConfig): Promise<any> {
	config = setCommonHeader(config);
	return ConfigService.axios.get(url, config).then((res) => res.data);
}

export function fetchPost<T>(url: string, data?: Partial<T>, config?: MyAxiosRequestConfig): Promise<any> {
	config = setCommonHeader(config);
	return ConfigService.axios.post(url, data, config).then((res) => res.data);
}

export function fetchPut<T>(url: string, data?: Partial<T>, config?: MyAxiosRequestConfig): Promise<any> {
	config = setCommonHeader(config);
	return ConfigService.axios.put(url, data, config).then((res) => res.data);
}

export function fetchDel(url: string, config?: MyAxiosRequestConfig): Promise<any> {
	config = setCommonHeader(config);
	return ConfigService.axios.delete(url, config).then((res) => res.data);
}
