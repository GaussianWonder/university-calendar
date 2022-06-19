import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import Input from "../app/input/Input";
import SubmitModal, { BaseSearchModalProps } from "./SubmitModal";
import Quill from "quill";
import { SolidQuill } from "../quill/SolidQuill";
import auth from "../../store/auth";
import { expectJson } from "../../logic/fetching";
import { Faculty } from "../../types/models/faculty";

export interface CreateFacultyModalProps extends BaseSearchModalProps {
  universityId: number;
}

const CreateFacultyModal: Component<CreateFacultyModalProps> = (props) => {
  const [name, setName] = createSignal('');
  const [isSuccess, setIsSuccess] = createSignal<boolean | undefined>(undefined);
  let quill: Quill;

  const createFaculty = () => {
    const [authState] = auth;

    if (quill && quill.getContents) {
      const state = authState();
      const description = quill.getContents();

      fetch('http://localhost:3000/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.access_token}`,
        },
        body: JSON.stringify({
          name: name(),
          description: JSON.stringify(description),
          universityId: props.universityId,
        }),
      })
        .then(expectJson<Faculty>(['id', 'name', 'description']))
        .then(() => { setIsSuccess(true) })
        .catch(e => { console.log(e); setIsSuccess(false) });
    }
  };

  return (
    <Portal>
      <SubmitModal
        title="Create Faculty"
        show={ props.show }
        onClose={() => { props.onClose() }}
        onSubmit={(e) => {
          props.onSubmit(e);
          createFaculty();
        }}
      >
        <p mt-1 />

        <Input
          type="text"
          name="name"
          label="Title"
          onInput={(e) => setName(e.target.value)}
        />

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

export default CreateFacultyModal;
