import { Navigate, Route, Routes } from 'solid-app-router';
import { Component, createContext, useContext } from 'solid-js';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import createLocalStore from './primitives/create-local-store';

export interface AuthResponse {
  access_token: string | null;
}

export interface AuthUser {
  id: number;
  name: string;
}

export interface AuthState {
  authResponse: AuthResponse;
  authUser: AuthUser | null;
}

export interface AuthStoreMutations {
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthStateContext = createContext<[AuthState, AuthStoreMutations]>();

export const useAuth = () => useContext(AuthStateContext);

const App: Component = () => {
  const [state, setState] = createLocalStore<AuthState>(
    {
      authResponse: { access_token: null },
      authUser: null,
    },
    (storage) => {
      const data = storage.getItem('auth');
      if (!data)
        return null;
      return JSON.parse(data);
    },
    (storage, value) => {
      storage.setItem('auth', JSON.stringify(value));
    },
  );

  const setToken = (token: string) => {
    setState({
      authResponse: {
        access_token: token,
      },
      authUser: state.authUser,
    });
  };

  const setUser = (user: AuthUser) => {
    setState({
      authResponse: state.authResponse,
      authUser: user,
    });
  };

  const logout = () => {
    setState({
      authResponse: { access_token: null },
      authUser: null,
    });
  };

  return (
    <AuthStateContext.Provider value={[state, { setToken, setUser, logout }]}>
      <Routes>
        <Route path="/">
          <Navigate href="/home" />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AuthStateContext.Provider>
  );
};

export default App;
