import { Component, createResource, createSignal, createUniqueId, For, mergeProps, onCleanup, ResourceFetcher, Show } from 'solid-js';
import createDebounce from '../../../primitives/create-debouncer';
import Input from '../input/Input';
import auth from "../../../store/auth";
import clickOutside from '../../../directives/click-outside';
false && clickOutside;

export interface FetchParams {
  search: string;
  token: string;
}

export interface SearchPopupProps<T> {
  id?: string;
  label?: string;
  class?: string;
  containerClass?: string;
  listClass?: string;
  onSelect?: (item: T) => void;
}

export interface SearchPopupFactoryProps<T> {
  fetcher: ResourceFetcher<FetchParams, T[]>;
  ItemRenderer: Component<{ item: T; onClick: () => void; }>;
  debounceTimeout?: number;
}

export function SearchPopupComponent<T>({ fetcher, debounceTimeout, ItemRenderer }: SearchPopupFactoryProps<T>): Component<SearchPopupProps<T>> {
  const inputDebounce: number = debounceTimeout ?? 500;

  return (props) => {
    const merged = mergeProps({
      id: createUniqueId(),
      label: 'Search',
      class: '',
      containerClass: '',
      listClass: '',
    }, props);

    const [authState] = auth;
    const accessToken = () => {
      const state = authState();
      return state.access_token;
    };

    const [isFocused, setIsFocused] = createSignal<boolean>(false);
    const [fetchParams, setFetchParams] = createSignal<FetchParams>({
      search: '',
      token: accessToken(),
    });

    const [triggerSearch, cleanSearchDebouncer] = createDebounce<(newVal: string) => void>(
      (newVal) => {
        setFetchParams({
          search: newVal,
          token: accessToken(),
        });
      },
      inputDebounce,
    );
  
    onCleanup(() => { cleanSearchDebouncer() });
  
    const [data, { refetch }] = createResource(fetchParams, fetcher, {
      deferStream: true,
    });

    const focusSelector = () => {
      setIsFocused(true);
    };

    const blurSelector = () => {
      setIsFocused(false);
    };

    return (
      <div
        class={`relative group ${merged.containerClass}`}
        use:clickOutside={blurSelector}
      >
        <div class={`flex flex-row gap-1 items-center justify-items-center ${merged.class}`}>
          <label sr-only for={merged.id}>
            {merged.label}
          </label>
  
          <div class="relative flex items-center">
            <Show
              when={data.loading}
              fallback={<div i-bx-search w-6 h-6 text-gray-400 class="absolute z-10 ml-2" />}
            >
              <div i-bx-loader-alt w-6 h-6 text-gray-400 class="absolute z-10 ml-2" animate-spin />
            </Show>
  
            <div
              i-bx-refresh
              w-6 h-6
              text-gray-500
              cursor-pointer
              class="absolute transition inset-r-0 group-hover:translate-x-6"
              onClick={() => { refetch(); focusSelector() }}
            />
  
            <Input
              id={merged.id}
              type="text"
              placeholder={merged.label}
              onInput={(e) => { triggerSearch(e.target.value) }}
              class="relative"
              inputPadding="pl-8"
              onClick={focusSelector}
            />
  
          </div>
        </div>
        <div
          transition opacity-0 group-hover:opacity-100
          class={`absolute min-w-xs max-h-sm overflow-auto ${merged.listClass}`}
        >
          <Show when={isFocused() && data && !data.loading}>
            <For each={data()}>{
              (item) => <ItemRenderer item={item} onClick={() => { merged.onSelect(item) }} />
            }</For>
          </Show>
        </div>
      </div>
    );
  };
}

export default SearchPopupComponent;
