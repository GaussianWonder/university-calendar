import { Component } from 'solid-js';
import InformativeLabel from '../components/app/label/InformativeLabel';
import FacultyList from '../components/app/list/FacultyList';
import SidebarNav from '../components/nav/SidebarNav';
import PageHeading from '../layouts/PageHeading';
import SidebarLayout from '../layouts/SidebarLayout';

const FacultiesPage: Component = () => {
  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Faculties</h2>}
        subtitle={
          <>
            <InformativeLabel>
              <div i-bx-info-circle w-4 h-4 /> Faculties you have permission to access
            </InformativeLabel>
          </>
        }
      >
        <FacultyList class='gap-1' params={{ universityId: undefined }} />
      </PageHeading>
    </SidebarLayout>
  );
};

export default FacultiesPage;
