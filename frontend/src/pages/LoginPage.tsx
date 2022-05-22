import { Component, Show } from 'solid-js';
import { useAuth } from '../App';
import LoginForm from '../components/app/forms/LoginForm';
import InformativeLabel from '../components/app/label/InformativeLabel';
import Button from '../components/button/Button';
import SidebarNav from '../components/nav/SidebarNav';
import PageHeading from '../layouts/PageHeading';
import SidebarLayout from '../layouts/SidebarLayout';

const LoginPage: Component = () => {
  const [auth, { logout }] = useAuth();

  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Login</h2>}
        subtitle={
          <>
            <Show when={auth.authResponse.access_token}>
              <InformativeLabel>
                <div i-bx-user mr-1 /> Already logged in
              </InformativeLabel>
            </Show>
            <InformativeLabel>
              <div i-bx-log-in-circle mr-1 /> Login into&nbsp;
              <Show
                when={!auth.authResponse.access_token}
                fallback={
                  <span>
                    <span text-yellow-500>another&nbsp;</span>
                    account
                  </span>
                }
              >
                an account
              </Show>
            </InformativeLabel>
          </>
        }
        actions={
          <Show when={auth.authResponse.access_token}>
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
          <LoginForm />
        </div>
      </PageHeading>
    </SidebarLayout>
  );
};

export default LoginPage;
