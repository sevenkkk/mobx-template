import { useMemo } from 'react';
import { ListStoreConfig, ViewListStore } from '../view-store/view-list-store';
import { ObjStoreConfig, ViewObjStore } from '../view-store/view-object-store';

const commonDataMap: Map<string, any> = new Map<string, any>();

export interface CommonListConfig<T, P> extends ListStoreConfig<T, P> {
	refresh?: boolean
}

export function useCommonListStore<T, P = Record<string, any>>(
	key: string,
	fetch: (params: P) => Promise<any>,
	config?: CommonListConfig<T, P>,
): ViewListStore<T, P> {
	const store = useMemo(() => {
		const {refresh} = config || {refresh: false};
		if (commonDataMap.has(key) && !refresh) {
			return commonDataMap.get(key);
		}
		const _store = new ViewListStore<T, P>(fetch, config);
		if (_store.config?.autoLoad) {
			_store.loadData().then();
		}
		commonDataMap.set(key, _store);
		return _store;
	}, []);
	return store;
}


export interface CommonObjConfig<T, P> extends ObjStoreConfig<T, P> {
	refresh?: boolean
}

export function useCommonObjStore<T, P = Record<string, any>>(
	key: string,
	fetch: (params: P) => Promise<any>,
	config?: CommonObjConfig<T, P>,
): ViewObjStore<T, P> {
	const store = useMemo(() => {
		const {refresh} = config || {refresh: false};
		if (commonDataMap.has(key) && !refresh) {
			return commonDataMap.get(key);
		}
		const _store = new ViewObjStore<T, P>(fetch, config);
		if (_store.config?.autoLoad) {
			_store.loadData().then();
		}
		commonDataMap.set(key, _store);
		return _store;
	}, []);
	return store;
}
