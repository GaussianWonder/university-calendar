import { Component, mergeProps } from "solid-js";

interface AppLogoProps {
  class?: string;
}

const AppLogo: Component<AppLogoProps> = (props) => {
  const merged = mergeProps({
    class: '',
  }, props);

  return (
    <div i-bx-calendar class={`${merged.class}`} />
  );
};

export default AppLogo;
