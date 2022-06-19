import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import Input from "../app/input/Input";
import SubmitModal, { BaseSearchModalProps } from "./SubmitModal";
import Quill from "quill";
import { SolidQuill } from "../quill/SolidQuill";
import auth from "../../store/auth";
import { expectJson } from "../../logic/fetching";
import { Course } from "../../types/models/course";

export interface CreateCourseModalProps extends BaseSearchModalProps {
  facultyId: number;
}

const CreateCourseModal: Component<CreateCourseModalProps> = (props) => {
  const [name, setName] = createSignal('');
  const [isSuccess, setIsSuccess] = createSignal<boolean | undefined>(undefined);
  let quill: Quill;

  const createCourse = () => {
    const [authState] = auth;

    if (quill && quill.getContents) {
      const state = authState();
      const description = quill.getContents();

      fetch('http://localhost:3000/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.access_token}`,
        },
        body: JSON.stringify({
          name: name(),
          description: JSON.stringify(description),
          facultyId: props.facultyId,
        }),
      })
        .then(expectJson<Course>(['id', 'name', 'description']))
        .then(() => { setIsSuccess(true) })
        .catch(e => { console.log(e); setIsSuccess(false) });
    }
  };

  return (
    <Portal>
      <SubmitModal
        title="Create Course"
        show={ props.show }
        onClose={() => { props.onClose() }}
        onSubmit={(e) => {
          props.onSubmit(e);
          createCourse();
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

export default CreateCourseModal;
