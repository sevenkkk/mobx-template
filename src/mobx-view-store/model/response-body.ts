export interface ResponseBody {
	success: boolean
	errorMessage: string
	errorCode: string
	payload: any
	count: number
}

export interface ResponseMessage {
	success: boolean
	data: string
}

export interface ResponseData<T> {
	success: boolean
	data: T
}
