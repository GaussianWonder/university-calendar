import { Component, ParentProps, children as resolveChildren, Show } from "solid-js";
import Button from "../button/Button";
import LineBreak from "../LineBreak";
import LeftRightStrip from "../strip/LeftRightStrip";

type EventToHandle = Event & {
  submitter: HTMLElement;
} & {
  currentTarget: HTMLFormElement;
  target: Element;
};

export interface BaseSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: EventToHandle) => void;
}

export interface SubmitModalProps extends BaseSearchModalProps{
  title: string;
}

const SubmitModal: Component<ParentProps<SubmitModalProps>> = (props) => {
  const children = resolveChildren(() => props.children);
  const isVisible = () => props.show;
  const headerTitle = () => props.title;
  const close = () => props.onClose;
  const submit = () => props.onSubmit;

  return (
    <Show when={isVisible()}>
      <div class="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            submit()(e);

            return false;
          }}
          flex flex-col
          class="grow max-w-2xl sm:min-w-sm bg-white border border-gray-200 shadow-lg rounded-lg"
        >
          <LeftRightStrip
            class="px-4 mt-1"
            left={<h1 pt-2 text-2xl font-medium>{ headerTitle() }</h1>}
            right={<div i-bx-x w-8 h-8 text-red-500 cursor-pointer onClick={() => { close()() }} />}
          />
          
          <LineBreak />

          <div class="grow px-2">
          { children() }
          </div>

          <LineBreak />

          <LeftRightStrip
            class="px-4 mb-2"
            left={(
              <Button style="danger" onClick={() => { close()() }}>
                Cancel
              </Button>
            )}
            right={(
              <Button style="primary" type="submit">
                Submit
              </Button>
            )}
          />
        </form>
      </div>
    </Show>
  );
};

export default SubmitModal;
