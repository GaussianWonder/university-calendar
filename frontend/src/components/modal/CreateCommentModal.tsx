import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import SubmitModal, { BaseSearchModalProps } from "./SubmitModal";
import Quill from "quill";
import { SolidQuill } from "../quill/SolidQuill";
import auth from "../../store/auth";
import { expectJson } from "../../logic/fetching";
import { Rcomment } from "../../types/models/rcomment";

export interface CreateCommentModalProps extends BaseSearchModalProps {
  taskId: number;
}

const CreateCommentModal: Component<CreateCommentModalProps> = (props) => {
  const [isSuccess, setIsSuccess] = createSignal<boolean | undefined>(undefined);
  let quill: Quill;

  const createTask = () => {
    const [authState] = auth;

    if (quill && quill.getContents) {
      const state = authState();
      const content = quill.getContents();

      fetch('http://localhost:3000/rcomment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.access_token}`,
        },
        body: JSON.stringify({
          content: JSON.stringify(content),
          taskId: props.taskId,
        }),
      })
        .then(expectJson<Rcomment>(['id', 'content']))
        .then(() => { setIsSuccess(true) })
        .catch(e => { console.log(e); setIsSuccess(false) });
    }
  };

  return (
    <Portal>
      <SubmitModal
        title="New Comment"
        show={ props.show }
        onClose={() => { props.onClose() }}
        onSubmit={(e) => {
          props.onSubmit(e);
          createTask();
        }}
      >
        <p mt-1 />

        <div>
          <SolidQuill
            class="min-h-[200px] max-h-sm overflow-auto"
            placeholder="Write a description..."
            ref={quill}
            as="div"
          />
        </div>

        <Show when={isSuccess() !== undefined}>
          <Show when={isSuccess()} fallback={<div i-bx-error text-red-500 w-10 h-10 />}>
            <div i-bx-check text-green-500 w-10 h-10 />
          </Show>
        </Show>

      </SubmitModal>
    </Portal>
  );
};

export default CreateCommentModal;
