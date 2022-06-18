import { Component } from 'solid-js';
import InformativeLabel from '../components/app/label/InformativeLabel';
import CourseList from '../components/app/list/CourseList';
import SidebarNav from '../components/nav/SidebarNav';
import PageHeading from '../layouts/PageHeading';
import SidebarLayout from '../layouts/SidebarLayout';

const CoursesPage: Component = () => {
  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Courses</h2>}
        subtitle={
          <>
            <InformativeLabel>
              <div i-bx-info-circle w-4 h-4 /> Courses you have permission to access
            </InformativeLabel>
          </>
        }
      >
        <CourseList class='gap-1' params={{ facultyId: undefined }} />
      </PageHeading>
    </SidebarLayout>
  );
};

export default CoursesPage;
