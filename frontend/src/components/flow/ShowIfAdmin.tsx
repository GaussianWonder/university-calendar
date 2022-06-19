import { children, Component, JSX, ParentProps, Show } from "solid-js";
import auth from "../../store/auth";
import { UserRole } from "../../types/models/user";

const ShowIfUserRole: Component<ParentProps<{ fallback?: JSX.Element; role: UserRole }>> = (props) => {
  const c = children(() => props.children);
  const [authState] = auth;

  const isAdmin = () => {
    const state = authState();
    return !!state.access_token && state.user.role === props.role;
  };

  return (
    <Show when={isAdmin()} fallback={props.fallback}>{ c() }</Show>
  );
};

export default ShowIfUserRole;
