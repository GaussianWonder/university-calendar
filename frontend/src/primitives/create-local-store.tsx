import { createEffect } from "solid-js";
import { createStore, DeepReadonly, SetStoreFunction, Store } from "solid-js/store";

type StorageConsumer<T> = (storage: Storage) => T | null;
type StorageSetter<T> = (storage: Storage, value: T) => void;

export default function createLocalStore<T>(initState: T, getFromStorage: StorageConsumer<T>, setToStorage: StorageSetter<DeepReadonly<T>>): [Store<T>, SetStoreFunction<T>] {
	const [state, setState] = createStore(initState);

  const data = getFromStorage(localStorage);
  if (data)
    setState(data);

	createEffect(() => {
    setToStorage(localStorage, state);
  });

	return [state, setState];
}
