import { Component, ParentProps, children as resolveChildren } from 'solid-js';
import LeftRightStrip from './LeftRightStrip';

export interface RightStripProps {
}

const RightStrip: Component<ParentProps<RightStripProps>> = (props) => {
  const children = resolveChildren(() => props.children);

  return <LeftRightStrip
    right={children()}
  />;
};

export default RightStrip;
