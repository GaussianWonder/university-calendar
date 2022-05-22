import '@unocss/reset/tailwind.css';
import 'uno.css';
import { children as resolveChildren, Component, ParentProps } from 'solid-js';

export const PreviewJsWrapper: Component<ParentProps> = (props) => {
  const children = resolveChildren(() => props.children);
  return <>{children()}</>;
};

export default PreviewJsWrapper;
