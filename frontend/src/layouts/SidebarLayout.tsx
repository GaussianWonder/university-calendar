import { Link } from 'solid-app-router';
import { Component, ParentProps, children as resolveChildren, JSXElement, createSignal, Show } from 'solid-js';
import AppLogo from '../components/app/AppLogo';
import auth from '../store/auth';

export interface SidebarLayoutProps {
  sidebar: JSXElement;
}

const SidebarLayout: Component<ParentProps<SidebarLayoutProps>> = (props) => {
  const [authState] = auth;

  const headerTitle = () => {
    const state = authState();
    if (state.user && state.user.username) {
      return state.user.username;
    } else {
      return 'UCAPP';
    }
  };

  const children = resolveChildren(() => props.children);
  const sidebarChildren = resolveChildren(() => props.sidebar);

  const [mobileNavigation, setMobileNavigation] = createSignal<boolean>(false);
  const toggleMobileNavigation = () => setMobileNavigation(!mobileNavigation());

  return (
    <div class="w-screen h-screen flex flex-row">
      <div class="hidden md:flex shrink-0 flex-col md:w-64 lg:w-80 bg-gray-800 h-full gap-2">
        <Link href="/home">
          <div
            w-full h-20 shadow rounded-br-3xl transition-colors
            bg="gray-900 hover:gray-800"
            border="b-2 r-2 transparent hover:gray-900"
            p="y-2 x-4"
            class="group flex flex-row items-center justify-items-center gap-1 shadow hover:cursor-pointer"
          >
            <AppLogo class='w-10 h-10 text-indigo-600 group-hover:text-indigo-500 transition-colors' />
            <span font="medium sans" text="white 2xl">
              { headerTitle() }
            </span>
          </div>
        </Link>
        { sidebarChildren() }
      </div>

      <main class="flex flex-col grow bg-gray-100">
        <div class="flex md:hidden flex-row justify-between bg-gray-800 text-gray-100 py-5 px-4">
          <button
            p-px rounded-full cursor-pointer
            border="2 white"
            ring="hover:2 indigo-800"
            transition-all duration-75
            hover:scale-110 hover:rotate-90 duration-200
            type="button"
            onClick={toggleMobileNavigation}
          >
            <div i-bx-dots-vertical-rounded w-6 h-6 />
          </button>
          <h1
            text="xl"
            font="medium sans"
          >
            Naviation
          </h1>
        </div>
        <Show when={mobileNavigation()}>
          <div class="md:hidden -mt-5">
            { sidebarChildren() }
          </div>
        </Show>
        { children() }
      </main>
    </div>
  );
};

export default SidebarLayout;
