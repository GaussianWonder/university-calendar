import { Component, ParentProps, mergeProps, JSXElement, children as resolveChildren } from 'solid-js';

export interface LeftRightStripProps {
  left?: JSXElement;
  right?: JSXElement;
  class?: string;
}

const LeftRightStrip: Component<ParentProps<LeftRightStripProps>> = (props) => {
  const merged = mergeProps({
    left: <></>,
    right: <></>,
    class: '',
  }, props);

  const leftChildren = resolveChildren(() => merged.left);
  const rightChildren = resolveChildren(() => merged.right);

  return <>
    <div class={`lg:flex lg:items-center lg:justify-between ${merged.class}`}>
      <div class="flex-1 min-w-0">
        {leftChildren()}
      </div>
      <div class="mt-5 flex lg:mt-0 lg:ml-4">
        {rightChildren()}
      </div>
    </div>
  </>;
};

export default LeftRightStrip;
