import { Component, JSX, mergeProps, Show, splitProps } from "solid-js";

export interface InputProps {
  type?: JSX.InputHTMLAttributes<HTMLInputElement>['type'];
  name?: string;
  label?: string;
}

export interface AllInputProps extends InputProps {
  [key: keyof JSX.InputHTMLAttributes<HTMLInputElement> | string]: unknown;
}

const Input: Component<AllInputProps> = (props) => {
  const merged = mergeProps({
    type: 'text' as JSX.InputHTMLAttributes<HTMLInputElement>['type'],
  }, props);

  const [base, others] = splitProps(merged, ['type', 'name', 'label']);

  return (
    <div mb-4>
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
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900"
        {...others}
      />
    </div>
  );
};

export default Input;
