import { useParams } from "solid-app-router";
import { Component, createResource, createSignal, Show } from "solid-js";
import PageHeading from "../layouts/PageHeading";
import SidebarLayout from "../layouts/SidebarLayout";
import auth from "../store/auth";
import { expectJson } from "../logic/fetching";
import Quill from "quill";
import SidebarNav from "../components/nav/SidebarNav";
import InformativeLabel from "../components/app/label/InformativeLabel";
import Button from "../components/button/Button";
import { SolidQuill } from "../components/quill/SolidQuill";
import NotFoundHeading from "../components/app/errors/NoFoundHeading";
import { Faculty } from "../types/models/faculty";
import CourseList from "../components/app/list/CourseList";
import InviteUser from "../components/app/popup/InviteUser";
import { RoleCategory, UserRole } from "../types/models/user";
import ShowIfUserRole from "../components/flow/ShowIfAdmin";
import CreateCourseModal from "../components/modal/CreateCourseModal";

const FacultyPage: Component = () => {
  let quill: Quill;
  const params = useParams();
  const ID = () => Number(params.id);

  const [showCreateModal, setShowCreateModal] = createSignal<boolean>(false);

  const [data, { refetch }] = createResource(
    ID,
    async (id) => {
      if (!id) return null;
      const [authState] = auth;
      const token = authState()?.access_token;
      if (!token) return null;

      const faculty = fetch(`http://localhost:3000/faculty/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(expectJson<Faculty>(['id', 'name', 'description']))
        .catch(e => {
          console.error(e);
          return null as Faculty;
        });

      return faculty;
    },
    { deferStream: true },
  );

  const isFound = () => {
    const resource = !!data();
    return !!resource;
  };

  const name = () => {
    const resource = data();
    if (!resource)
      return '';
    return resource.name;
  };

  return (
    <SidebarLayout sidebar={<SidebarNav />}>
      <PageHeading
        title={
          <Show when={!data.loading} fallback={<div i-bx-loader-alt w-10 h-10 text-gray-400 animate-spin />}>
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Faculty {name()}</h2>
          </Show>
        }
        subtitle={
          <>
            <InformativeLabel>
              <div i-bx-book w-4 h-4 /> Courses of faculty
            </InformativeLabel>
          </>
        }
        actions={
          <Show when={isFound()}>
            <div class='flex gap-2'>
              <InviteUser subjectId={ID()} category={RoleCategory.Faculty} />
              <ShowIfUserRole role={UserRole.Admin}>
                <Button style='warning' onClick={() => { setShowCreateModal(true) }}>
                  New Course
                </Button>
              </ShowIfUserRole>
              <Button style='primary' onClick={() => { refetch() }}>
                <div i-bx-refresh w-5 h-5 />
              </Button>
            </div>
          </Show>
        }
      >
        <Show when={!data.loading && isFound()} fallback={<Show when={!data.loading}><NotFoundHeading /></Show>}>
          <div>
            <div>
              <SolidQuill
                class="bg-gray-100 min-h-[200px] max-h-sm overflow-auto rounded-lg"
                placeholder="No description"
                ref={quill}
                as="div"
                contentEditable={false}
                readOnly={true}
                modules={{ toolbar: false, clipboard: { matchVisual: false } }}
                onReady={(q) => {
                  const resource = data();
                  if (resource && resource.description) {
                    q.setContents(resource.description);
                  }
                }}
              />
            </div>

            <CourseList class="gap-1" params={{ facultyId: ID() }} />
          </div>
        </Show>
        <ShowIfUserRole role={UserRole.Admin}>
          <CreateCourseModal
            show={showCreateModal()}
            onClose={() => { setShowCreateModal(false) }}
            onSubmit={(e) => { console.log(e) }}
            facultyId={ID()}
          />
        </ShowIfUserRole>
      </PageHeading>
    </SidebarLayout>
  );
};

export default FacultyPage;
