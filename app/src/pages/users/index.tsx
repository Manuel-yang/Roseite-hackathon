import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineKey } from "react-icons/hi";
import { UserType } from "../../models";
import UserList from "../../components/UserList";
import Base from "../../templates/Base";
import TweetSearch from "../../components/TweetSearch";
import RecentUsers from "../../components/RecentUsers";
// import useUsers from "../../hooks/useUsers";

export default function Users() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [filterUsers, setFilterUsers] = useState<UserType[]>([]);

  // const { users, recentUsers, loading } = useUsers();

  const search = (str: string) => {
    router.push(`/users/${str}`);
  };

  // const onTextChange = (text: string) => {
  //   const fUsers = users.filter((k) => k.user.toBase58().includes(text));
  //   setUser(text);
  //   setFilterUsers(fUsers);
  // };

  // useEffect(() => {
  //   setFilterUsers(users);
  // }, [users]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Users
            </h2>
          </div>
          <TweetSearch
            placeholder="user public key"
            disabled={!user}
            modelValue={user}
            // setModelValue={onTextChange}
            search={search}
          >
            <HiOutlineKey size={20} className="text-color-third" />
          </TweetSearch>
          {/* <UserList users={filterUsers} loading={loading} /> */}
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">Recent Users</h3>
            {/* <RecentUsers users={recentUsers} /> */}
          </div>
        </div>
      </div>
    </Base>
  );
}
