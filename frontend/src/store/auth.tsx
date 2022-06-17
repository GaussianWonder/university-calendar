import { Accessor, createEffect, createResource, createRoot, ResourceFetcher } from "solid-js";
import { DeepReadonly } from "solid-js/store";
import createLocalStore from "../primitives/create-local-store";
import { UserRole } from "../types/models/user";

export interface AuthResponse {
  access_token: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
}

export interface AuthState extends AuthResponse {
  user: AuthUser;
}

const invalidToken: AuthResponse['access_token'] = '';
const invalidUser: AuthUser = {
  id: -1,
  username: '',
  role: '',
};

const initAuthState: AuthState = {
  access_token: invalidToken,
  user: {
    ...invalidUser,
  },
};

// Input for /me request
interface MeBody {
  token: string;
}

type MeFetcher = ResourceFetcher<MeBody, AuthUser>;

export const performMeFetch: MeFetcher = async (meBody) => {
  if (!meBody.token)
    return { ...invalidUser };

  const response = await fetch('http://localhost:3000/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${meBody.token}`,
      },
    });

  if (!response.ok)
    return { ...invalidUser };

  const data: AuthUser = await response.json();

  if (!data || !data.id || !data.username)
    return { ...invalidUser };

  return data;
};

function createAuthState() {
  // Create local auth store
  const [authStore, setAuthStore] = createLocalStore(initAuthState, 'auth');

  // Split auth store into readonly data & mutations
  const authState: Accessor<DeepReadonly<AuthState>> = () => authStore;
  const setToken = (t?: string) => setAuthStore({
    access_token: t ?? '',
    user: !!t ? authState().user : { ...invalidUser },
  });
  const setUser = (u?: AuthUser) => setAuthStore({
    access_token: authState().access_token,
    user: u ?? { ...invalidUser },
  });
  const logout = () => setAuthStore({
    access_token: invalidToken,
    user: { ...invalidUser },
  });

  // Utility for reactive fetching of /me
  const token = () => ({ token: authState().access_token });

  const [data, { refetch }] = createResource(token, performMeFetch, {
    deferStream: true,
  });

  // Refetch /me when the token changes
  createEffect(() => {
    if (!!authState().access_token)
      refetch();
  });

  // setUser when the user object changes
  createEffect(() => {
    const meData = data();
    if(meData && meData.id && meData.username) {
      setUser({ ...meData });
    } else {
      setUser({ ...invalidUser });
    }
  });

  // Return auth store and mutators
  return [authState, setToken, setUser, logout] as const;
}

// Register createAuthState as a global store provider with mutations
export default createRoot(createAuthState);
