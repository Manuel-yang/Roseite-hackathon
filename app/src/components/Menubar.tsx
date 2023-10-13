import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Breadcrumb } from "flowbite-react";
import { HiOutlineHome } from "react-icons/hi";
import WalletItem from "./WalletItem";
import UserEditModal from "./UserEditModal";
import { useRouter } from "next/router";
import ThemeSwitcher from "./ThemeSwitcher";
// import useUsers from "../hooks/useUsers";

export default function Menubar() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [alias, setAlias] = useState("");

  // const { getUserAlias } = useUsers();
  const wallet = useAnchorWallet();
  const { connected } = useWallet();

  useEffect(() => {
    if (wallet && !showEditModal) {
      // getUserAlias(wallet.publicKey).then((value) => setAlias(value));
    }
  // }, [wallet, showEditModal, getUserAlias]);
}, [wallet, showEditModal]);

  return (
    <div className="fixed top-0 w-full z-40">
      <div className="ml-72">
        <div className="duration-400 sticky top-0 z-20 ml-px">
          <div className="sticky top-0 z-40 transition-colors bg-fill-opacity backdrop-blur">
            <div className="h-16 flex items-center justify-between border-b border-skin-primary px-6 transition-all">
              <div className="relative flex w-full items-center"></div>
              <div className="flex items-center gap-5">
                <ThemeSwitcher />
                {wallet && connected && (
                  <>
                    <WalletItem
                      publicKey={wallet.publicKey}
                      alias={alias}
                      showModal={() => setShowEditModal(true)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <div className="fixed">
              <Path />
            </div>
          </div>
        </div>
      </div>
      {wallet && (
        <UserEditModal
          visible={showEditModal}
          setVisible={setShowEditModal}
          publicKey={wallet.publicKey}
          alias={alias}
        />
      )}
    </div>
  );
}

function Path() {
  const [pathName, setPathName] = useState("");
  const router = useRouter();

  useEffect(() => {
    setPathName(router.pathname);
  }, [router.pathname]);

  type PathType = {
    path: string;
    name: string;
  };

  const generatePaths = () => {
    let data: PathType[] = [];
    switch (pathName) {
      case "/":
        data.push({ path: "", name: "Tweets" });
        break;
      case "/404":
        data.push({ path: "", name: "NotFound" });
        break;
      case "/tweets":
        data.push({ path: "", name: "Tweets" });
        break;
      case "/tags":
        data.push({ path: "", name: "Tags" });
        break;
      case "/users":
        data.push({ path: "", name: "Users" });
        break;
      case "/profile":
        data.push({ path: "", name: "Profile" });
        break;
      case "/tags/[tag]":
        data.push({ path: "/tags", name: "Tags" });
        data.push({ path: "", name: router.query.tag as string });
        break;
      case "/users/[user]":
        data.push({ path: "/users", name: "Users" });
        data.push({ path: "", name: router.query.user as string });
        break;
      case "/tweets/[tweet]":
        data.push({ path: "/tweets", name: "Tweets" });
        data.push({ path: "", name: router.query.tweet as string });
        break;
    }

    return generatePath(data);
  };

  const generatePath = (data: PathType[]) => {
    return (
      <Breadcrumb className="py-0.5 px-6">
        <Breadcrumb.Item href="/" key={0}>
          <span className="flex items-center text-color-secondary hover:text-color-primary">
            <HiOutlineHome className="mr-2" size="16" />
            <span>Home</span>
          </span>
        </Breadcrumb.Item>
        {data.map((item, i) => {
          if (item.path)
            return (
              <Breadcrumb.Item key={i + 1} href={item.path}>
                <span className="text-color-secondary hover:text-color-primary">
                  {item.name}
                </span>
              </Breadcrumb.Item>
            );
          else
            return (
              <Breadcrumb.Item key={i + 1}>
                <span className="text-color-third">{item.name}</span>
              </Breadcrumb.Item>
            );
        })}
      </Breadcrumb>
    );
  };

  return (
    <div className="fixed">
      <div className="text-sm relative z-20 bg-gradient-to-r from-gray-800/20 to-transparent pb-px backdrop-blur transition-all">
        {generatePaths()}
      </div>
    </div>
  );
}
