import { Component, ParentProps, children as resolveChildren } from 'solid-js';

const InformativeLabel: Component<ParentProps> = (props) => {
  const children = resolveChildren(() => props.children);

  return (
    <div class="mt-2 flex items-center justify-items-center text-sm text-gray-500">
      {children()}
    </div>
  );
};

export default InformativeLabel;
