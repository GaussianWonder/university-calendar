import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import Input from "../app/input/Input";
import SubmitModal, { BaseSearchModalProps } from "./SubmitModal";
import Quill from "quill";
import { SolidQuill } from "../quill/SolidQuill";
import auth from "../../store/auth";
import { expectJson } from "../../logic/fetching";
import { Task } from "../../types/models/task";

export interface CreateTaskModalProps extends BaseSearchModalProps {
  courseId: number;
}

const CreateTaskModal: Component<CreateTaskModalProps> = (props) => {
  const [name, setName] = createSignal('');
  const [dueDate, setDueDate] = createSignal<Date>();
  const [isSuccess, setIsSuccess] = createSignal<boolean | undefined>(undefined);
  let quill: Quill;

  const createTask = () => {
    const [authState] = auth;

    if (quill && quill.getContents) {
      const state = authState();
      const description = quill.getContents();

      fetch('http://localhost:3000/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.access_token}`,
        },
        body: JSON.stringify({
          name: name(),
          description: JSON.stringify(description),
          courseId: props.courseId,
          dueDate: dueDate(),
        }),
      })
        .then(expectJson<Task>(['id', 'name', 'description', 'dueDate']))
        .then(() => { setIsSuccess(true) })
        .catch(e => { console.log(e); setIsSuccess(false) });
    }
  };

  return (
    <Portal>
      <SubmitModal
        title="Create Task"
        show={ props.show }
        onClose={() => { props.onClose() }}
        onSubmit={(e) => {
          props.onSubmit(e);
          createTask();
        }}
      >
        <p mt-1 />

        <Input
          type="text"
          name="name"
          label="Title"
          onInput={(e) => setName(e.target.value)}
        />

        <Input
          type="date"
          name="dueDate"
          label="Due date"
          onInput={(e) => setDueDate(new Date(e.target.value)) }
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

export default CreateTaskModal;
