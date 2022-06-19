import { children, Component, JSX, ParentProps, Show } from "solid-js";
import auth from "../../store/auth";

const ShowIfAuthed: Component<ParentProps<{ fallback?: JSX.Element }>> = (props) => {
  const c = children(() => props.children);
  const [authState] = auth;

  const isAuthed = () => {
    const state = authState();
    return !!state.access_token;
  };

  return (
    <Show when={isAuthed()} fallback={props.fallback}>{ c() }</Show>
  );
};

export default ShowIfAuthed;
