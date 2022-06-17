import { Component, JSX, mergeProps, Show, splitProps } from "solid-js";

export interface InputProps {
  type?: JSX.InputHTMLAttributes<HTMLInputElement>['type'];
  name?: string;
  label?: string;
  class?: string;
  inputPadding?: string;
}

export interface AllInputProps extends InputProps {
  [key: keyof JSX.InputHTMLAttributes<HTMLInputElement> | string]: unknown;
}

const Input: Component<AllInputProps> = (props) => {
  const merged = mergeProps({
    type: 'text' as JSX.InputHTMLAttributes<HTMLInputElement>['type'],
    class: 'mb-4',
    inputPadding: '',
  }, props);

  const [base, others] = splitProps(merged, ['type', 'name', 'label', 'class', 'inputPadding']);

  return (
    <div class={base.class}>
      <Show when={!!base.label && !!base.name}>
        <label
          class="block text-gray-800 text-sm font-medium mb-2"
          for={merged.name}
        >
          {base.label}
        </label>
      </Show>
      <input
        type={base.type}
        name={base.name}
        class={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${base.inputPadding}`}
        {...others}
      />
    </div>
  );
};

export default Input;
