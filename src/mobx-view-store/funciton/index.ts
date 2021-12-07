import { ViewSubmitStore, SubmitStoreConfig } from '../view-store/view-submit-store';
import { ListStoreConfig, ViewListStore } from '../view-store/view-list-store';
import { PageListStoreConfig, ViewPageListStore } from '../view-store/view-page-list-store';
import { ObjStoreConfig, ViewObjStore } from '../view-store/view-object-store';
import { ModalStoreConfig, ViewModalStore } from '../view-store/view-modal-store';

/**
 * Submit template
 * @param fetch
 * @param config
 */
export function fromSubmitStore<P = Record<string, any>, T = string>(fetch: (body: P) => Promise<any>,
                                                                     config?: SubmitStoreConfig<P, T>): ViewSubmitStore<P, T> {
	return new ViewSubmitStore<P, T>(fetch, config);
}

/**
 * List template
 * @param fetch
 * @param config
 */
export function fromListStore<T, P = Record<string, any>>(fetch: (params: P) => Promise<any>,
                                                          config?: ListStoreConfig<T, P>): ViewListStore<T, P> {
	return new ViewListStore<T, P>(fetch, config);
}

/**
 * Page list template
 * @param fetch
 * @param config
 */
export function fromPageListStore<T, P = Record<string, any>>(fetch: (body: P) => Promise<any>,
                                                              config?: PageListStoreConfig<T, P>): ViewPageListStore<T, P> {
	return new ViewPageListStore<T, P>(fetch, config);
}

/**
 * Obj template
 * @param fetch
 * @param config
 */
export function fromObjStore<T, P = Record<string, any>>(fetch: (params: P) => Promise<any>,
                                                         config?: ObjStoreConfig<T, P>): ViewObjStore<T, P> {
	return new ViewObjStore<T, P>(fetch, config);
}

/**
 * Modal template
 * @param config
 */
export function fromModalStore<T = Record<string, any>>(config?: ModalStoreConfig): ViewModalStore<T> {
	return new ViewModalStore<T>(config);
}


