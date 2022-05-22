import { Component, ParentProps, children as resolveChildren, JSXElement, mergeProps } from "solid-js";
import LeftRightStrip from "../components/strip/LeftRightStrip";

interface PageHeadingProps {
  title: JSXElement;
  subtitle?: JSXElement;
  actions?: JSXElement;
}

const PageHeading: Component<ParentProps<PageHeadingProps>> = (props) => {
  const merged = mergeProps({
    subtitle: <></>,
    actions: <></>,
  }, props);

  const children = resolveChildren(() => props.children);
  const titleChildren = resolveChildren(() => merged.title);
  const subtitleChildren = resolveChildren(() => merged.subtitle);
  const actionsChildren = resolveChildren(() => merged.actions);

  return (
    <div p-2 sm:p-8 w-full h-full class="flex flex-col">
      <LeftRightStrip
        left={
          <>
            { titleChildren() }
            <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              { subtitleChildren() }
            </div>
          </>
        }
        right={actionsChildren()}
      />
      <main w-full h-full overflow-y-auto mt-4>
        { children() }
      </main>
    </div>
  );
};

export default PageHeading;
