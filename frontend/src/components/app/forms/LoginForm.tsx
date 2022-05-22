import { Component, createEffect, createResource, createSignal, onCleanup, ResourceFetcher, Show } from "solid-js";
import { AuthResponse, useAuth } from "../../../App";
import createDebounce from "../../../primitives/create-debouncer";
import Button from "../../button/Button";
import LeftRightStrip from "../../strip/LeftRightStrip";
import Input from "../input/Input";

type LoginBody = {
  username: string;
  password: string;
}
type LoginFetcher = ResourceFetcher<LoginBody, AuthResponse>;

export const performLogin: LoginFetcher = async (loginBody) => {
  if (!loginBody.username || !loginBody.password)
    return {
      access_token: null,
    };

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
    return {
      access_token: null,
    };

  const data: AuthResponse = await response.json();

  if (!data || !data.access_token)
    return {
      access_token: null,
    };

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
  const [, { setToken }] = useAuth();

  const loginSource = () => ({
    username: username(),
    password: password(),
  });

  const [data, { refetch }] = createResource(loginSource, performLogin, {
    deferStream: true,
  });

  const [triggerLogin, cleanLoginDebouncer] = createDebounce<LoginBodySetEffect>(
    (toSet) => {
      if (toSet.username)
        setUsername(toSet.username);
      if (toSet.password)
        setPassword(toSet.password);
    },
    500,
  );

  onCleanup(() => { cleanLoginDebouncer() });

  const token = () => (data()?.access_token ?? null);

  createEffect(() => {
    const currentToken = token();
    if (currentToken) setToken(currentToken);
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
        right={
          <Button
            style="primary"
            onClick={() => refetch(data)}
            disabled={data.loading}
          >
            Login
          </Button>
        }
      />
    </div>
  );
};

export default LoginForm;
