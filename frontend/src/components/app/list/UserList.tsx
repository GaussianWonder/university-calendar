import { expectJsonArray } from "../../../logic/fetching";
import { User } from "../../../types/models/user";
import ListComponent from "./List";

const UserSearchPopup = ListComponent<User, { username: string; limit: number; }>({
  fetcher: async ({ params, token }) => {
    const urlParams = new URLSearchParams({
      username: params.username,
      limit: params.limit.toString(),
    });

    const users = await fetch(`http://localhost:3000/users?${urlParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(expectJsonArray<User>(['id', 'username', 'role']))
      .catch(e => {
        console.error(e);
        return [] as User[];
      });

    return users;
  },
  ItemRenderer: (props) => {
    const onClick = () => props.onClick;
    const item = () => props.item;
    return (
      <div
        flex flex-col
        p="x-2 y-1"
        class="bg-white shadow rounded cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-300"
        onClick={onClick()}
      >
        <p class="text-lg text-gray-800">{item().username}</p>
        <p class="text-base text-gray-500 flex flex-row gap-1 items-center">
          <span class="text-xs font-light text-gray-400">{item().id}</span>
          <span>{item().role}</span>
        </p>
      </div>
    );
  },
});

export default UserSearchPopup;
