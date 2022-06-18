import { Component, mergeProps } from "solid-js";

export interface LineBreakProps {
  class?: string;
}

const LineBreak: Component<LineBreakProps> = (props) => {
  const merged = mergeProps({
    class: 'px-2 my-2 h-[2px]',
  }, props);

  return (
    <div w-full class={merged.class}>
      <div w-full h-full bg-gray-200 rounded-full />
    </div>
  );
};

export default LineBreak;
