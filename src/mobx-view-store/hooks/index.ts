import { DependencyList, useEffect, useMemo, useState } from 'react';
import { ViewSubmitStore, SubmitStoreConfig } from '../view-store/view-submit-store';
import { ListStoreConfig, ViewListStore } from '../view-store/view-list-store';
import { ObjStoreConfig, ViewObjStore } from '../view-store/view-object-store';
import { PageListStoreConfig, ViewPageListStore } from '../view-store/view-page-list-store';
import { ModalStoreConfig, ViewModalStore } from '../view-store/view-modal-store';

/**
 * Submit template
 * @param fetch
 * @param config
 * @param deps
 */
export function useSubmit<P = Record<string, any>, T = string>(fetch: (body: P) => Promise<any>,
                                                                    config?: SubmitStoreConfig<P, T>,
                                                                    deps?: DependencyList): ViewSubmitStore<P, T> {
	return useMemo(() => {
		return new ViewSubmitStore<P, T>(fetch, config);
	}, deps ?? []);
}

/**
 * List template
 * @param fetch
 * @param config
 * @param deps
 */
export function useFetchList<T, P = Record<string, any>>(fetch: (params: P) => Promise<any>,
                                                              config?: ListStoreConfig<T, P>,
                                                              deps?: DependencyList): ViewListStore<T, P> {
	const store = useMemo(() => {
		return new ViewListStore<T, P>(fetch, config);
	}, deps ?? []);

	useEffect(() => {
		if (config?.autoLoad) {
			if (config?.autoClear) {
				store.clear();
			}
			if (typeof config?.autoLoad === 'function') {
				const params = config?.autoLoad();
				store.loadData(params).then();
			} else {
				store.loadData().then();
			}
		}
	}, [store]);
	return store;
}

/**
 * Page list template
 * @param fetch
 * @param config
 * @param deps
 */
export function useFetchPageList<T, P = Record<string, any>>(fetch: (body: P) => Promise<any>,
                                                                  config?: PageListStoreConfig<T, P>,
                                                                  deps?: DependencyList): ViewPageListStore<T, P> {
	const store = useMemo(() => {
		return new ViewPageListStore<T, P>(fetch, config);
	}, deps ?? []);

	useEffect(() => {
		if (config?.autoLoad) {
			if (config?.autoClear) {
				store.clear();
			}
			if (typeof config?.autoLoad === 'function') {
				const params = config?.autoLoad();
				store.loadData(params).then();
			} else {
				store.loadData().then();
			}
		}
	}, [store]);
	return store;
}

/**
 * Obj template
 * @param fetch
 * @param config
 * @param deps
 */
export function useFetch<T, P = Record<string, any>>(fetch: (params: P) => Promise<any>,
                                                             config?: ObjStoreConfig<T, P>,
                                                             deps?: DependencyList): ViewObjStore<T, P> {
	const store = useMemo(() => {
		return new ViewObjStore<T, P>(fetch, config);
	}, deps ?? []);
	useEffect(() => {
		if (config?.autoLoad) {
			if (config?.autoClear) {
				store.clear();
			}
			if (typeof config?.autoLoad === 'function') {
				const params = config?.autoLoad();
				store.loadData(params).then();
			} else {
				store.loadData().then();
			}
		}
	}, [store]);
	return store;
}

/**
 * Use My Store
 * @param initialState
 */
export function useStore<S>(initialState: S | (() => S)): S {
	return useState(initialState)[0];
}

/**
 * Modal template
 * @param config
 */
export function useModal<T = Record<string, any> | string>(config?: ModalStoreConfig): ViewModalStore<T> {
	return new ViewModalStore<T>(config);
}

/**
 * Modal Effect
 * @param onOpen
 * @param onClose
 * @param modal
 */
export function useModalEffect<T = Record<string, any>>(onOpen: (data?: T) => void, onClose: () => void, modal: ViewModalStore<T>) {
	useEffect(() => {
		if (modal.visible) {
			onOpen(modal.data);
		} else if (!modal.visible) {
			onClose();
		}
	}, [modal, onOpen, onClose]);
}

/**
 * Modal Effect only onOpen
 * @param onOpen
 * @param modal
 */
export function useModalOpenEffect<T = Record<string, any>>(onOpen: (data?: T) => void, modal: ViewModalStore<T>) {
	useEffect(() => {
		if (modal.visible) {
			onOpen(modal.data);
		}
	}, [modal, onOpen]);
}

/**
 * Modal Effect only onClose
 * @param onClose
 * @param modal
 */
export function useModalCloseEffect(onClose: () => void, modal: ViewModalStore) {
	useEffect(() => {
		if (!modal.visible) {
			onClose();
		}
	}, [modal, onClose]);
}
