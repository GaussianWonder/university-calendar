import { Component, Show } from 'solid-js';
import RegisterForm from '../components/app/forms/RegisterForm';
import InformativeLabel from '../components/app/label/InformativeLabel';
import Button from '../components/button/Button';
import SidebarNav from '../components/nav/SidebarNav';
import PageHeading from '../layouts/PageHeading';
import SidebarLayout from '../layouts/SidebarLayout';
import auth from '../store/auth';

const RegisterPage: Component = () => {
  const [authState, logout] = auth;

  const isLoggedIn = () => {
    return !!authState().access_token;
  };

  const username = () => {
    return isLoggedIn() ? authState().user.username : '...loading';
  };

  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Register</h2>}
        subtitle={
          <>
            <Show when={isLoggedIn()}>
              <InformativeLabel>
                <div i-bx-user mr-1 /> Already logged in as&nbsp;
                <span text-green-500>{ username() }</span>
              </InformativeLabel>
            </Show>
            <InformativeLabel>
              <div i-bx-log-in-circle mr-1 /> Register a&nbsp;
              <span>
                <span text-yellow-500>new&nbsp;</span>
                account
              </span>
            </InformativeLabel>
            <InformativeLabel>
              <div i-bx-info-circle mr-1 /> A successful register automatically logs you in 
            </InformativeLabel>
          </>
        }
        actions={
          <Show when={isLoggedIn()}>
            <Button
              style='danger'
              onClick={() => logout()}
            >
              Logout
            </Button>
          </Show>
        }
      >
        <div>
          <RegisterForm />
        </div>
      </PageHeading>
    </SidebarLayout>
  );
};

export default RegisterPage;
