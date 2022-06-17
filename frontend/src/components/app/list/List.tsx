import { Accessor, Component, createEffect, createResource, createSignal, For, mergeProps, ResourceFetcher, Show } from 'solid-js';
import Input from '../input/Input';
import auth from "../../../store/auth";

export interface FetchParams<D> {
  params: D;
  token: string;
}

export interface ListProps<T> {
  class?: string;
  onSelect?: (item: T) => void;
}

export interface ListFactoryProps<T, D> {
  fetcher: ResourceFetcher<FetchParams<D>, T[]>;
  ItemRenderer: Component<{ item: T; onClick: () => void; }>;
  params: D;
}

export function ListComponent<T, D>({ fetcher, ItemRenderer, params }: ListFactoryProps<T, D>): Component<ListProps<T>> {
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

    const [fetchParams, setFetchParams] = createSignal<FetchParams<D>>({
      params: params,
      token: accessToken(),
    });

    createEffect(() => {
      // const newParams = params();
      const token = accessToken();
      setFetchParams({
        params: params,
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
