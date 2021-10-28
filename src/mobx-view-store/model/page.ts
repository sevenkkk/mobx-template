export interface Page {
	page?: number
	pageSize?: number
}

export interface PageView {
	page: number
	pageSize: number
	count: number
	loadDataPage: (page: number, pageSize?: number) => Promise<boolean>
}
