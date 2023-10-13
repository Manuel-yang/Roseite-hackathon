import Link from "next/link";
import { Avatar } from "flowbite-react";
import useWorkspace from "../hooks/useWorkspace";
import { UserType } from "../models";
import Loader from "./Loader";

interface UserListProps {
  users: UserType[];
  loading: boolean;
}

export default function UserList(props: UserListProps) {
  const { users, loading } = props;
  const workspace = useWorkspace();

  return (
    <>
      {workspace ? (
        loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto relative">
            <table className="w-full text-sm text-left text-color-secondary">
              <thead className="text-xs uppercase bg-fill-secondary">
                <tr>
                  <th scope="col" className="py-3 px-3"></th>
                  <th scope="col" className="py-3 px-3">
                    User
                  </th>
                  <th scope="col" className="py-3 px-3"></th>
                  <th scope="col" className="py-3 px-3">
                    LAST POST
                  </th>
                  <th scope="col" className="py-3 px-3">
                    TOTAL POSTS
                  </th>
                </tr>
              </thead>
              <tbody>
                {users
                  .sort((a, b) => b.total_posts - a.total_posts)
                  .map((user, key) => {
                    const userRoute =
                      workspace.wallet.publicKey.toBase58() ===
                      user.user.toBase58()
                        ? "/profile"
                        : `/users/${user.user.toBase58()}`;
                    return (
                      <tr
                        key={key}
                        className="bg-fill-primary border-b border-skin-primary"
                      >
                        <td className="py-4 pl-6 pr-3 text-color-secondary">{`#${
                          key + 1
                        }`}</td>
                        <td className="py-4 px-3">
                          <Link href={userRoute}>
                            <a>
                              <Avatar
                                img={`https://avatars.dicebear.com/api/jdenticon/${user.user.toBase58()}.svg`}
                                size="md"
                                rounded={true}
                              />
                            </a>
                          </Link>
                        </td>
                        <td className="py-4 px-3">
                          <Link href={userRoute}>
                            <a className="font-semibold hover:underline text-color-primary">
                              {user.user.toBase58()}
                            </a>
                          </Link>
                          <br />
                          <span className="text-color-third">
                            {user.user_display}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <Link href={`/tweets/${user.tweet.toBase58()}`}>
                            <a className="hover:underline text-color-secondary">
                              <span>{user.created_ago}</span>
                            </a>
                          </Link>
                          <br />
                          <span className="border border-solid border-sky-500 rounded-full">
                            <Link href={`/tags/${user.last_tag}`}>
                              <a className="text-primary-500 text-sm hover:underline px-1 py-0">
                                {`#${user.last_tag}`}
                              </a>
                            </Link>
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <Link href={userRoute}>
                            <a className="hover:underline text-color-secondary">
                              {user.total_posts}
                            </a>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="border-b border-skin-primary bg-fill-secondary px-8 py-4 text-center text-color-third">
          Connect your wallet to start tweeting...
        </div>
      )}
    </>
  );
}
