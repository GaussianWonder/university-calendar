/* eslint-disable @typescript-eslint/no-namespace */
import { Accessor, onCleanup } from "solid-js";

export default function clickOutside(el: HTMLElement, accessor: Accessor<() => void>) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: () => void;
    }
  }
}
