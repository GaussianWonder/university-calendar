import { Component, createEffect, createResource, createSignal, For, mergeProps, ResourceFetcher, Show } from 'solid-js';
import auth from "../../../store/auth";
import Button from '../../button/Button';
import LeftRightStrip from '../../strip/LeftRightStrip';

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

    const [isGridView, setIsGridView] = createSignal<boolean>(true);

    const listContainerClass = () => {
      const baseClass = 'grid grid-cols-1';
      const isGrid = isGridView();
      
      if (isGrid)
        return `${baseClass} md:grid-cols-2 lg:grid-cols-3`;
      return baseClass;
    };

    return (
      <Show when={data && !data.loading} fallback={<div i-bx-loader-alt w-10 h-10 text-gray-400 animate-spin />}>
        <LeftRightStrip
          class="px-4 py-2"
          left={(
            <Button
              style='secondary'
              onClick={() => { setIsGridView(!isGridView()) }}
            >
              <Show when={isGridView} fallback={<div i-bx-list-ul w-6 h-6 text-gray-500 cursor-pointer />}>
                <div i-bx-grid-alt w-6 h-6 text-gray-500 />
              </Show>
            </Button>
          )}
          right={(
            <Button
              style='primary'
              onClick={() => { refetch() }}
            >
              <div i-bx-refresh w-6 h-6 text-white />
            </Button>
          )}
        />

        <div class={`${listContainerClass()} ${merged.class}`}>
          <For each={data()}>{
            (item) => <ItemRenderer item={item} onClick={() => { merged.onSelect(item) }} />
          }</For>
        </div>
      </Show>
    );
  };
}

export default ListComponent;
