import { Component, createEffect, createResource, createSignal, ResourceFetcher, Show } from "solid-js";
import auth, { AuthResponse, AuthUser } from "../../../store/auth";
import Button from "../../button/Button";
import LeftRightStrip from "../../strip/LeftRightStrip";
import Input from "../input/Input";
import { performLogin } from "./LoginForm";

type RegisterBody = {
  username: string;
  password: string;
}
type RegisterFetcher = ResourceFetcher<RegisterBody, AuthResponse>;

export const performRegister: RegisterFetcher = async (registerBody) => {
  if (!registerBody.username || !registerBody.password)
    return { access_token: '' };

  const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: registerBody.username,
        password: registerBody.password,
      }),
    });

  if (!response.ok)
    return { access_token: '' };

  const data: AuthUser = await response.json();

  if (!data || !data.id || !data.username)
    return { access_token: '' };

  const authResponse = await performLogin(registerBody, { value: undefined, refetching: false });

  if (!authResponse || !authResponse.access_token)
    return { access_token: '' };

  return authResponse;
};

const RegisterForm: Component = () => {
  const [username, setUsername] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [, setToken] = auth;

  const [registerSource, setRegisterSource] = createSignal<RegisterBody>({
    username: '',
    password: '',
  });

  const fetchUsingRegisterBody = () => {
    setRegisterSource({
      username: username(),
      password: password(),
    });
  };

  const [data] = createResource(registerSource, performRegister, {
    deferStream: true,
  });

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
        onInput={(e) => setUsername(e.target.value)}
      />

      <Input
        type="password"
        name="password"
        label="Password"
        onInput={(e) => setPassword(e.target.value)}
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
            onClick={fetchUsingRegisterBody}
            disabled={data.loading}
          >
            Register
          </Button>
        }
      />
    </div>
  );
};

export default RegisterForm;
