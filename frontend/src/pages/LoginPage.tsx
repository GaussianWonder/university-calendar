import { Component } from 'solid-js';
import SidebarNav from '../components/nav/SidebarNav';
import PageHeading from '../layouts/PageHeading';
import SidebarLayout from '../layouts/SidebarLayout';

export interface LoginPageProps {

}

const LoginPage: Component<LoginPageProps> = (props) => {
  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Login</h2>}
      >
        Login Form
      </PageHeading>
    </SidebarLayout>
  );
};

export default LoginPage;
