import { Component } from 'solid-js';
import InformativeLabel from '../components/app/label/InformativeLabel';
import UserSearchPopup from '../components/app/popup/UserSearch';
import Button from '../components/button/Button';
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
            <InformativeLabel>
              <div i-bx-briefcase w-4 h-4 /> Work
            </InformativeLabel>
            <InformativeLabel>
              <div i-bx-accessibility w-4 h-4 /> Accessibility
            </InformativeLabel>
            <InformativeLabel>
              <div i-bx-timer w-4 h-4 /> Timer
            </InformativeLabel>
          </>
        }
        actions={
          <div class='flex gap-2'>
            <Button>
              Secondary
            </Button>
            <Button style='primary'>
              Primary
            </Button>
            <Button style='warning'>
              Warning
            </Button>
            <Button style='danger'>
              Danger
            </Button>
          </div>
        }
      >
        <br />
        <UserSearchPopup
          onSelect={(item) => {
            console.log(`${item.id} was selected`);
          }}
          listClass="mt-1 flex flex-col gap-1"
        />
      </PageHeading>
    </SidebarLayout>
  );
};

export default HomePage;
