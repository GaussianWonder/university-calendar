import { Component, createEffect, createResource, createSignal, onCleanup, ResourceFetcher, Show } from "solid-js";
import createDebounce from "../../../primitives/create-debouncer";
import auth, { AuthResponse } from "../../../store/auth";
import LeftRightStrip from "../../strip/LeftRightStrip";
import Input from "../input/Input";

type LoginBody = {
  username: string;
  password: string;
}
type LoginFetcher = ResourceFetcher<LoginBody, AuthResponse>;

export const performLogin: LoginFetcher = async (loginBody) => {
  if (!loginBody.username || !loginBody.password)
    return { access_token: '' };

  const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginBody.username,
        password: loginBody.password,
      }),
    });

  if (!response.ok)
    return { access_token: '' };

  const data: AuthResponse = await response.json();

  if (!data || !data.access_token)
    return { access_token: '' };

  return data;
};

interface LoginBodySetParams {
  username?: string;
  password?: string;
}
type LoginBodySetEffect = (toSet: LoginBodySetParams) => void;

const LoginForm: Component = () => {
  const [username, setUsername] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [, setToken] = auth;

  const loginSource = () => ({
    username: username(),
    password: password(),
  });

  const [data] = createResource(loginSource, performLogin, {
    deferStream: true,
  });

  const [triggerLogin, cleanLoginDebouncer] = createDebounce<LoginBodySetEffect>(
    (toSet) => {
      const username = toSet.username;
      const password = toSet.password;

      if (username) setUsername(username);
      if (password) setPassword(password);
    },
    500,
  );

  onCleanup(() => { cleanLoginDebouncer() });

  createEffect(() => {
    const authResponse = data();
    if (authResponse && !!authResponse.access_token) setToken(authResponse.access_token);
  });

  return (
    <div px-1 max-w-lg>
      <Input
        type="text"
        name="username"
        label="Username"
        onInput={(e) => triggerLogin({username: e.target.value})}
      />

      <Input
        type="password"
        name="password"
        label="Password"
        onInput={(e) => triggerLogin({password: e.target.value})}
      />

      <LeftRightStrip
        left={
          <>
            <Show when={data.loading}>
              <div i-bx-grid-small animate-rotate-in w-6 h-6 animate-alternate animate-ease-in-out />
            </Show>
            <Show when={data.error}>
              <span text-red-500>Errors...</span>
            </Show>
          </>
        }
      />
    </div>
  );
};

export default LoginForm;
