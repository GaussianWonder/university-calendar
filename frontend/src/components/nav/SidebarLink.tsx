import { NavLink } from "solid-app-router";
import { Component, mergeProps } from "solid-js";

export interface SidebarLinkProps {
  href: string;
  name: string;
  iconClass: string;

  class?: string;
  inactiveClass?: string;
  activeClass?: string;
}

const SidebarLink: Component<SidebarLinkProps> = (props) => {
  const merged = mergeProps({
    class: '',
    inactiveClass: '',
    activeClass: 'before:(bg-indigo-400 mr-3 w-3 h-3 rounded-full content-[attr(before)])',
  }, props);

  return (
    <li class={merged.class}>
      <NavLink
        before=""
        href={merged.href}
        activeClass={merged.activeClass}
        inactiveClass={merged.inactiveClass}
        class='group flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700'
      >
        <div
          w-6 h-6
          text="gray-400 group-hover:white"
          transition duration-75
          class={merged.iconClass}
        />
        <span ml-3>
          {merged.name}
        </span>
      </NavLink>
    </li>
  );
};

export default SidebarLink;
