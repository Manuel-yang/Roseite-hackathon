// import { PublicKey } from "@solana/web3.js";
// import {
//   createContext,
//   ReactNode,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import useWorkspace from "../hooks/useWorkspace";
// import { UserType } from "../models";
// import { getUserAlias } from "../pages/api/alias";
// import { fetchUsers } from "../pages/api/tweets";

// interface UsersContextState {
//   users: UserType[];
//   recentUsers: UserType[];
//   loading: boolean;
//   getUserAlias: (publickey: PublicKey) => Promise<string>;
// }

// const UsersContext = createContext<UsersContextState>(null!);

// export function UsersProvider({ children }: { children: ReactNode }) {
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [recentUsers, setRecentUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(true);

//   const workspace = useWorkspace();

//   useEffect(() => {
//     if (workspace) {
//       setLoading(true);
//       fetchUsers(workspace)
//         .then((data) => {
//           setUsers(data);
//           const recentOrdered = data
//             .sort((a, b) => b.last_timestamp - a.last_timestamp)
//             .slice(0, 5);
//           setRecentUsers(recentOrdered);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setUsers([]);
//       setRecentUsers([]);
//       setLoading(false);
//     }
//   }, [workspace]);

//   const getUserAliasFromPublicKey = useCallback(
//     async (publicKey: PublicKey) => {
//       if (workspace) {
//         const alias = await getUserAlias(workspace.program, publicKey);
//         return alias;
//       } else {
//         return "";
//       }
//     },
//     [workspace]
//   );

//   const value = useMemo(
//     () => ({
//       users,
//       recentUsers,
//       loading,
//       getUserAlias: getUserAliasFromPublicKey,
//     }),
//     [users, recentUsers, loading, getUserAliasFromPublicKey]
//   );

//   return (
//     <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
//   );
// }

// export default UsersContext;
