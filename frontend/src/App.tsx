import { Navigate, Route, Routes } from 'solid-app-router';
import type { Component } from 'solid-js';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: Component = () => {
  return (
    <>
      <Routes>
        <Route path="/">
          <Navigate href="/home" />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

export default App;
