import { createEffect } from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";

export default function createLocalStore<T extends object>(initState: T, localStorageKey = 'store'): [Store<T>, SetStoreFunction<T>] {
	const [store, setStore] = createStore(initState);

  if (localStorage[localStorageKey]) {
    try {
      setStore(JSON.parse(localStorage[localStorageKey]));
    } catch (error) {
      setStore(() => initState);
    }
  }

	createEffect(() => {
    localStorage[localStorageKey] = JSON.stringify(store);
  });

  return [store, setStore];
}
