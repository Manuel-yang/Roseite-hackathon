import Link from "next/link";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  HiHashtag,
  HiOutlineHashtag,
  HiHome,
  HiOutlineHome,
  HiUser,
  HiOutlineUser,
  HiUserGroup,
  HiOutlineUserGroup,
} from "react-icons/hi";
import useTheme from "../hooks/useTheme";

export default function Sidebar() {
  const router = useRouter();
  const { connected } = useWallet();
  const { theme } = useTheme();

  return (
    <aside className="fixed h-full w-72">
      <div className="h-full overflow-y-auto border-r border-skin-primary">
        <div className="relative mb-8">
          <div className="relative overflow-hidden">
            <div className="glass absolute left-[2.5%] z-0 h-80 w-full scale-x-105 opacity-30"></div>
            <div className="flex h-80 items-center justify-center">
              <div className="mb-6 select-none text-center">
                <div className="inline-block w-32 h-32 rounded-full overflow-hidden">
                  <img src="/logo.jpg" alt="logo" className="object-cover w-full h-full" />
                </div>
                <h1 className="mb-0 text-2xl font-semibold text-color-primary">ROSEITE</h1>
                <p className="text-xs italic text-color-secondary">Solana communication platform</p>
                <p className="text-xs italic text-color-secondary">Chat to earn! </p>
              </div>
            </div>
          </div>
          <div className="relative z-10 mx-auto -mt-[25px] w-48">
            <WalletMultiButton />
          </div>
        </div>
        <div className="mx-12 flex flex-col items-center space-y-2 md:items-stretch text-color-primary">
          <Link href="/">
            <a
              className={
                (router.pathname.startsWith("/tweets") || router.pathname === "/" ? "font-bold " : "") +
                "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-fill-third md:w-full"
              }
            >
              {router.pathname.startsWith("/tweets") || router.pathname === "/" ? (
                <HiHome size={28} />
              ) : (
                <HiOutlineHome size={28} />
              )}
              <div className="hidden text-xl md:block">Tweets</div>
            </a>
          </Link>
          <Link href="/tags">
            <a
              className={
                (router.pathname.startsWith("/tags") ? "font-bold " : "") +
                "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-fill-third md:w-full"
              }
            >
              {router.pathname.startsWith("/tags") ? <HiHashtag size={28} /> : <HiOutlineHashtag size={28} />}
              <div className="hidden text-xl md:block">Tags</div>
            </a>
          </Link>
          <Link href="/users">
            <a
              className={
                (router.pathname.startsWith("/users") ? "font-bold " : "") +
                "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-fill-third md:w-full"
              }
            >
              {router.pathname.startsWith("/users") ? <HiUserGroup size={28} /> : <HiOutlineUserGroup size={28} />}
              <div className="hidden text-xl md:block">Users</div>
            </a>
          </Link>
          {connected && (
            <Link href="/profile">
              <a
                className={
                  (router.pathname.startsWith("/profile") ? "font-bold " : "") +
                  "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-fill-third md:w-full"
                }
              >
                {router.pathname.startsWith("/profile") ? <HiUser size={28} /> : <HiOutlineUser size={28} />}
                <div className="hidden text-xl md:block">Profile</div>
              </a>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
