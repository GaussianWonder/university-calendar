import { useParams } from "solid-app-router";
import { Component, createResource, Show } from "solid-js";
import PageHeading from "../layouts/PageHeading";
import SidebarLayout from "../layouts/SidebarLayout";
import auth from "../store/auth";
import { expectJson } from "../logic/fetching";
import { University } from "../types/models/university";
import Quill from "quill";
import SidebarNav from "../components/nav/SidebarNav";
import InformativeLabel from "../components/app/label/InformativeLabel";
import UserSearchPopup from "../components/app/popup/UserSearch";
import Button from "../components/button/Button";
import { SolidQuill } from "../components/quill/SolidQuill";
import NotFoundHeading from "../components/app/errors/NoFoundHeading";
import FacultyList from "../components/app/list/FacultyList";

const UniversityPage: Component = () => {
  let quill: Quill;
  const params = useParams();
  const ID = () => Number(params.id);

  const [data, { refetch }] = createResource(
    ID,
    async (id) => {
      if (!id) return null;
      const [authState] = auth;
      const token = authState()?.access_token;
      if (!token) return null;

      const university = fetch(`http://localhost:3000/university/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(expectJson<University>(['id', 'name', 'description']))
        .catch(e => {
          console.error(e);
          return null as University;
        });

      return university;
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
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">University {name()}</h2>
          </Show>
        }
        subtitle={
          <>
            <InformativeLabel>
              <div i-bx-bxs-school w-4 h-4 /> Faculties of university
            </InformativeLabel>
          </>
        }
        actions={
          <Show when={isFound()}>
            <div class='flex gap-2'>
              <UserSearchPopup
                onSelect={(item) => {
                  console.log(`${item.id} was selected`);
                }}
                listClass="flex flex-col gap-1"
                params={undefined}
                label="Invite user"
              />
              <Button style='warning'>
                New
              </Button>
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
                placeholder="loading..."
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

            <FacultyList class='gap-1' params={{ universityId: ID() }} />
          </div>
        </Show>
      </PageHeading>
    </SidebarLayout>
  );
};

export default UniversityPage;
