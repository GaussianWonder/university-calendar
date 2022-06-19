import { Component, createSignal, Show } from "solid-js";
import { RoleCategory, RoleTitle, User, UserRole } from "../../../types/models/user";
import UserSearchPopup from "./UserSearch";
import auth from "../../../store/auth";
import { inviteUser } from "../../../logic/fetchers";

export interface InviteUserProps {
  subjectId: number;
  category: RoleCategory;
}

const InviteUser: Component<InviteUserProps> = (props) => {
  const [authState] = auth;
  const [title, setTitle] = createSignal<RoleTitle>(RoleTitle.Reader);

  const canInvite = () => {
    const { user } = authState();
    return user.role !== UserRole.Student;
  };

  const isAuthed = () => {
    const { access_token } = authState();
    return !!access_token;
  };

  const impartialInviteParams = () => ({
    subjectId: props.subjectId,
    category: props.category,
    title: title(),
    token: authState().access_token,
  });

  const invite = ({ id: userId }: User) => inviteUser({ ...impartialInviteParams(), userId })
    .then(role => {
      if (!role) {
        console.error('Could not invite user!');
      }

      console.log(role);
    });

  return (
    <Show when={isAuthed() && canInvite()}>
      {/* Select box */}
      <div class="relative" h-full>
        <div class="absolute" h-full flex items-center mx-1>
          <div i-bx-chevron-down w-6 h-6 text-gray-500 />
        </div>
        <select
          appearance-none
          h-full
          p="x-4 y-2 l-7"
          font="medium"
          text="sm"
          ring="focus:2 focus:offset-2"
          class="
            inline-flex items-center rounded-md shadow-sm focus:outline-none disabled:opacity-30 transition-opacity duration-100
            text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500 border border-gray-300
            pl-7
          "
          aria-placeholder="Select role type"
          onChange={(e) => {
            const { value } = e.currentTarget;
            if ([RoleTitle.Reader.toString(), RoleTitle.Moderator.toString()].includes(value))
              setTitle(value as RoleTitle);
          }}
        >
          <option value={RoleTitle.Reader}>Reader</option>
          <option value={RoleTitle.Moderator} >Moderator</option>
        </select>
      </div>
      {/* User search */}
      <UserSearchPopup
        onSelect={(item) => { invite(item) }}
        listClass="flex flex-col gap-1"
        params={undefined}
        label="Invite user"
      />
    </Show>
  );
};

export default InviteUser;
