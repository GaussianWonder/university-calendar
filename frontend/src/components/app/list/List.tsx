import { Component, createEffect, createResource, createSignal, For, mergeProps, ResourceFetcher, Show } from 'solid-js';
import auth from "../../../store/auth";

export interface ListFetchParams<P> {
  params: P;
  token: string;
}

export interface ListProps<T, P> {
  params: P;
  class?: string;
  onSelect?: (item: T) => void;
}

export interface ListFactoryProps<T, P> {
  fetcher: ResourceFetcher<ListFetchParams<P>, T[]>;
  ItemRenderer: Component<{ item: T; onClick: () => void; }>;
}

export function ListComponent<T, P=undefined>({ fetcher, ItemRenderer }: ListFactoryProps<T, P>): Component<ListProps<T, P>> {
  return (props) => {
    const merged = mergeProps({
      class: '',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSelect: () => {},
    }, props);

    const [authState] = auth;
    const accessToken = () => {
      const state = authState();
      return state.access_token;
    };

    const inputParams = () => {
      return props.params;
    };

    const [fetchParams, setFetchParams] = createSignal<ListFetchParams<P>>({
      params: inputParams(),
      token: accessToken(),
    });

    createEffect(() => {
      const newParams = inputParams();
      const token = accessToken();

      setFetchParams({
        params: newParams,
        token: token,
      });
    });
  
    const [data, { refetch }] = createResource(fetchParams, fetcher, {
      deferStream: true,
    });

    return (
      <Show when={data && !data.loading} fallback={<div i-bx-loader-alt w-10 h-10 text-gray-400 animate-spin />}>
        <div class={merged.class}>
          <For each={data()}>{
            (item) => <ItemRenderer item={item} onClick={() => { merged.onSelect(item) }} />
          }</For>
        </div>
      </Show>
    );
  };
}

export default ListComponent;
