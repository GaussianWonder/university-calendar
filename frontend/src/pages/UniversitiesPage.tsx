import { Component, createSignal } from 'solid-js';
import InformativeLabel from '../components/app/label/InformativeLabel';
import UniversityList from '../components/app/list/UniversityList';
import Button from '../components/button/Button';
import ShowIfUserRole from '../components/flow/ShowIfAdmin';
import CreateUniversityModal from '../components/modal/CreateUniversityModal';
import SidebarNav from '../components/nav/SidebarNav';
import PageHeading from '../layouts/PageHeading';
import SidebarLayout from '../layouts/SidebarLayout';
import { UserRole } from '../types/models/user';

const UniversitiesPage: Component = () => {
  const [showCreateModal, setShowCreateModal] = createSignal<boolean>(false);

  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Universities</h2>}
        subtitle={
          <>
            <InformativeLabel>
              <div i-bx-info-circle w-4 h-4 /> Universities you have permission to access
            </InformativeLabel>
          </>
        }
        actions={
          <div class='flex gap-2'>
            <ShowIfUserRole role={UserRole.Admin}>
              <Button style='warning' onClick={() => { setShowCreateModal(true) }}>
                New University
              </Button>
            </ShowIfUserRole>
          </div>
        }
      >
        <UniversityList class='gap-1' params={undefined} />

        <ShowIfUserRole role={UserRole.Admin}>
          <CreateUniversityModal
            show={showCreateModal()}
            onClose={() => { setShowCreateModal(false) }}
            onSubmit={(e) => { console.log(e) }}
          />
        </ShowIfUserRole>
      </PageHeading>
    </SidebarLayout>
  );
};

export default UniversitiesPage;
