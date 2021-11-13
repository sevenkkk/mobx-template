import { useEffect, useState } from 'react';
import { ViewSubmitStore, SubmitStoreConfig } from '../view-store/view-submit-store';
import { ListStoreConfig, ViewListStore } from '../view-store/view-list-store';
import { ObjStoreConfig, ViewObjStore } from '../view-store/view-object-store';
import { PageListStoreConfig, ViewPageListStore } from '../view-store/view-page-list-store';
import { ModalStoreConfig, ViewModalStore } from '../view-store/view-modal-store';

/**
 * Submit template
 * @param fetch
 * @param config
 */
export function useSubmitStore<T>(fetch: () => Promise<any>, config?: SubmitStoreConfig<any, T>) {
	return useSubmitPStore<any, T>(fetch, config);
}

/**
 * Submit template with parameters
 * @param fetch
 * @param config
 */
export function useSubmitPStore<P, T>(fetch: (body: P) => Promise<any>, config?: SubmitStoreConfig<P, T>) {
	return useState(() => new ViewSubmitStore<P, T>(fetch, config))[0];
}

/**
 * List template
 * @param fetch
 * @param config
 */
export function useFetchListStore<T>(fetch: () => Promise<any>, config?: ListStoreConfig<any, T>) {
	return useFetchListPStore<any, T>(fetch, config);
}

/**
 * List template with parameters
 * @param fetch
 * @param config
 */
export function useFetchListPStore<P, T>(fetch: (params: P) => Promise<any>, config?: ListStoreConfig<P, T>) {
	return useState(() => new ViewListStore<P, T>(fetch, config))[0];
}

/**
 * Page list template
 * @param fetch
 * @param config
 */
export function useFetchPageListStore<T>(fetch: () => Promise<any>, config?: PageListStoreConfig<any, T>) {
	return useFetchPageListPStore<any, T>(fetch, config);
}

/**
 * Page list template with parameters
 * @param fetch
 * @param config
 */
export function useFetchPageListPStore<P, T>(fetch: (params: P) => Promise<any>, config?: PageListStoreConfig<P, T>) {
	return useState(() => new ViewPageListStore<P, T>(fetch, config))[0];
}

/**
 * Obj template
 * @param fetch
 * @param config
 */
export function useFetchObjStore<T>(fetch: () => Promise<any>, config?: ObjStoreConfig<any, T>) {
	return useFetchObjPStore<any, T>(fetch, config);
}

/**
 * Obj template with parameters
 * @param fetch
 * @param config
 */
export function useFetchObjPStore<P, T>(fetch: (params: P) => Promise<any>, config?: ObjStoreConfig<P, T>) {
	return useState(() => new ViewObjStore<P, T>(fetch, config))[0];
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
export function useModalStore(config?: ModalStoreConfig): ViewModalStore {
	return useState(() => new ViewModalStore(config))[0];
}

/**
 * Modal Effect
 * @param onOpen
 * @param onClose
 * @param modal
 */
export function useModalEffect(onOpen: (data?: Record<string, any>) => void, onClose: () => void, modal: ViewModalStore) {
	useEffect(() => {
		if (modal.showModal) {
			onOpen(modal.data);
		} else if (!modal.showModal) {
			onClose();
		}
	}, [modal, onOpen, onClose]);
}

/**
 * Modal Effect only onOpen
 * @param onOpen
 * @param modal
 */
export function useModalOpenEffect(onOpen: (data?: Record<string, any>) => void, modal: ViewModalStore) {
	useEffect(() => {
		if (modal.showModal) {
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
		if (!modal.showModal) {
			onClose();
		}
	}, [modal, onClose]);
}
