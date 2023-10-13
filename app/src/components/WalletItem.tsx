import { useState } from "react";
import { Menu, MenuButton, MenuDivider, MenuItem } from "@szhsin/react-menu";
import { PublicKey } from "@solana/web3.js";
import { HiOutlineKey, HiOutlinePencilAlt, HiOutlineUserCircle, HiOutlineClipboardCopy } from "react-icons/hi";
import { toCollapse } from "../utils";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useWallet } from "@solana/wallet-adapter-react";
import useNftScanner from "../hooks/useNftScanner";

export default function WalletItem({
  publicKey,
  alias,
  showModal,
}: {
  publicKey: PublicKey;
  alias: string;
  showModal: () => void;
}) {
  const [copyLabel, setCopyLabel] = useState("Copy to clipboard");
  const { nftsList, selectedNftId } = useNftScanner();
  const { disconnect } = useWallet();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey.toBase58());
    setCopyLabel("Successfully Copied");
  };

  return (
    <Menu
      menuButton={
        <MenuButton>
          {selectedNftId !== undefined ? (
            <img
              className="w-11 rounded-full"
              src={nftsList[selectedNftId]?.data.metadata.image}
              alt={nftsList[selectedNftId]?.data.name}
            />
          ) : (
            <img
              className="w-10 rounded-full"
              src={`https://avatars.dicebear.com/api/jdenticon/${publicKey.toBase58()}.svg`}
            />
          )}
        </MenuButton>
      }
      transition
    >
      <MenuItem className="min-w-[15em]">
        {({ hover }) => (
          <div>
            <button
              className="group flex w-full items-center rounded-md text-left text-color-primary"
              onClick={copyToClipboard}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-500 text-primary-100">
                {hover ? <HiOutlineClipboardCopy size={20} /> : <HiOutlineKey size={20} />}
              </div>
              <div>
                <p className="text-sm">{hover ? copyLabel : "Signed in Wallet"}</p>
                <p className="font-medium">{toCollapse(publicKey)}</p>
              </div>
            </button>
          </div>
        )}
      </MenuItem>
      <MenuItem>
        {({ hover }) => (
          <div>
            <button
              className="group flex w-full items-center rounded-md text-left text-color-primary"
              onClick={showModal}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-500 text-primary-100">
                {hover ? <HiOutlinePencilAlt size={20} /> : <HiOutlineUserCircle size={20} />}
              </div>
              <div>
                <p className="text-sm">{hover ? "Edit Alias" : "User Alias"}</p>
                <p className="font-medium">{alias}</p>
              </div>
            </button>
          </div>
        )}
      </MenuItem>
      <MenuDivider />
      <MenuItem>
        <button className="flex w-full h-8 items-center px-3 text-color-primary" onClick={() => disconnect()}>
          Disconnect wallet
        </button>
      </MenuItem>
    </Menu>
  );
}
