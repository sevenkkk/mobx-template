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
export function fromSubmitStore<T>(fetch: () => Promise<any>, config?: SubmitStoreConfig<any, T>): ViewSubmitStore<any, T> {
	return new ViewSubmitStore<any, T>(fetch, config);
}

/**
 * Submit template with parameters
 * @param fetch
 * @param config
 */
export function fromSubmitPStore<P, T>(fetch: (body: P) => Promise<any>, config?: SubmitStoreConfig<P, T>): ViewSubmitStore<P, T> {
	return new ViewSubmitStore<P, T>(fetch, config);
}

/**
 * List template
 * @param fetch
 * @param config
 */
export function fromListStore<T>(fetch: () => Promise<any>, config?: ListStoreConfig<any, T>): ViewListStore<any, T> {
	return new ViewListStore<any, T>(fetch, config);
}

/**
 * List template with parameters
 * @param fetch
 * @param config
 */
export function fromListPStore<P, T>(fetch: (body: P) => Promise<any>, config?: ListStoreConfig<P, T>): ViewListStore<P, T> {
	return new ViewListStore<P, T>(fetch, config);
}

/**
 * Page list template
 * @param fetch
 * @param config
 */
export function fromPageListStore<T>(fetch: () => Promise<any>, config?: PageListStoreConfig<any, T>): ViewPageListStore<any, T> {
	return new ViewPageListStore<any, T>(fetch, config);
}

/**
 * Page list template with parameters
 * @param fetch
 * @param config
 */
export function fromPageListPStore<P, T>(fetch: (body: P) => Promise<any>, config?: PageListStoreConfig<P, T>): ViewPageListStore<P, T> {
	return new ViewPageListStore<P, T>(fetch, config);
}

/**
 * Obj template
 * @param fetch
 * @param config
 */
export function fromObjStore<T>(fetch: () => Promise<any>, config?: ObjStoreConfig<any, T>): ViewObjStore<any, T> {
	return new ViewObjStore<any, T>(fetch, config);
}

/**
 * Obj template with parameters
 * @param fetch
 * @param config
 */
export function fromObjPStore<P, T>(fetch: (params: P) => Promise<any>, config?: ObjStoreConfig<P, T>): ViewObjStore<P, T> {
	return new ViewObjStore<P, T>(fetch, config);
}

/**
 * Modal template
 * @param config
 */
export function fromModalStore(config?: ModalStoreConfig): ViewModalStore {
	return new ViewModalStore(config);
}


