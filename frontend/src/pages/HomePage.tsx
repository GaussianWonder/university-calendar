import { Component } from 'solid-js';
import SidebarNav from '../components/nav/SidebarNav';
import PageHeading from '../layouts/PageHeading';
import SidebarLayout from '../layouts/SidebarLayout';

const HomePage: Component = () => {
  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Dashboard</h2>}
        subtitle={
          <>
          </>
        }
      >
        <div class="mx-5 my-5">

        </div>
      </PageHeading>
    </SidebarLayout>
  );
};

export default HomePage;
