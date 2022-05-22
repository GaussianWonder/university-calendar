import { Component, ParentProps, children as resolveChildren, JSX, mergeProps, splitProps } from 'solid-js';

interface ButtonStyles {
  primary: string;
  secondary: string;
  warning: string;
  danger: string;
}

const styles: ButtonStyles = {
  primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border border-transparent',
  secondary: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500 border border-gray-300',
  warning: 'text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500 border border-transparent',
  danger: 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-700 border border-transparent',
};

export interface ButtonProps {
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  style?: keyof ButtonStyles;
  class?: string;
}

export interface AllButtonPRops extends ButtonProps {
  [key: keyof JSX.ButtonHTMLAttributes<HTMLButtonElement> | string]: unknown;
}

const Button: Component<ParentProps<AllButtonPRops>> = (props) => {
  const merged = mergeProps({
    type: 'button' as JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'],
    children: <></>,
    style: 'secondary' as keyof ButtonStyles,
    class: '',
  }, props);

  const [base, others] = splitProps(merged, ['type', 'style', 'class', 'children']);

  const children = resolveChildren(() => base.children);

  const currentStyle = () => styles[base.style];

  return (
    <button
      type={base.type}
      p="x-4 y-2"
      font="medium"
      text="sm"
      ring="focus:2 focus:offset-2"
      class={`
        inline-flex items-center rounded-md shadow-sm focus:outline-none disabled:opacity-30 transition-opacity duration-100
        ${currentStyle()}
        ${base.class}
      `}
      {...others}
    >
      {children()}
    </button>
  );
};

export default Button;
