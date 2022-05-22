import { Component } from "solid-js";
import AuthLinks from "../app/nav/AuthLinks";
import NavLinks from "../app/nav/NavLinks";

const SidebarNav: Component = () => {
  return (
    <div class="lg:overflow-y-auto py-4 px-3 bg-gray-800 rounded md:h-full flex flex-col">
      <ul class="space-y-2">
        <NavLinks />
      </ul>

      <ul class="mt-auto space-y-2">
        <AuthLinks />
      </ul>
    </div>
  );
};

export default SidebarNav;
