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
export function useSubmitStore<P = Record<string, any>, T = string>(fetch: (body: P) => Promise<any>,
																	config?: SubmitStoreConfig<P, T>): ViewSubmitStore<P, T> {
	return useState(() => new ViewSubmitStore<P, T>(fetch, config))[0];
}

/**
 * List template
 * @param fetch
 * @param config
 */
export function useFetchListStore<T, P = Record<string, any>>(fetch: (params: P) => Promise<any>,
															  config?: ListStoreConfig<T, P>): ViewListStore<T, P> {
	return useState(() => new ViewListStore<T, P>(fetch, config))[0];
}

/**
 * Page list template
 * @param fetch
 * @param config
 */
export function useFetchPageListStore<T, P = Record<string, any>>(fetch: (body: P) => Promise<any>,
																  config?: PageListStoreConfig<T, P>): ViewPageListStore<T, P> {
	return useState(() => new ViewPageListStore<T, P>(fetch, config))[0];
}

/**
 * Obj template
 * @param fetch
 * @param config
 */
export function useFetchObjStore<T, P = Record<string, any>>(fetch: (params: P) => Promise<any>,
															 config?: ObjStoreConfig<T, P>): ViewObjStore<T, P> {
	return useState(() => new ViewObjStore<T, P>(fetch, config))[0];
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
export function useModalStore<T = Record<string, any> | string>(config?: ModalStoreConfig): ViewModalStore<T> {
	return useState(() => new ViewModalStore<T>(config))[0];
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
