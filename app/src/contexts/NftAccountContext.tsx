import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import useWorkspace from "../hooks/useWorkspace";
import useNftScanner from "../hooks/useNftScanner";
import { nftInfo } from "./NftScannerContext";
import { getNftConfigPda } from "../utils/pdas";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { getPostPda } from "../utils/utils";

export type nftConfigPdaAccount = {
  bump: number;
  fansNum: BN;
  nftCurrentHolder: PublicKey;
  nftMint: PublicKey;
  postsNum: BN;
};

export type postPdaAccount = {
  content: string;
  likeNum: BN;
  nftAddress: PublicKey;
  reviewNum: BN;
  timeStamp: BN;
};

interface NftAccountState {
  selectedNft: nftInfo;
  nftConfigPdaAccount: nftConfigPdaAccount;
  postPdaAddressList: PublicKey[];
  rawPostPdaAccountList: postPdaAccount[];
  postPdaAccountList: postPdaAccount[];
  setPostPdaAddressList: React.Dispatch<React.SetStateAction<PublicKey[]>>;
  setRawPostPdaAccountList: (postPdaAddressList: postPdaAccount[]) => void;
  setPostPdaAccountList: (postPdaAddressList: postPdaAccount[]) => void;
}

const NftAccountContext = createContext<NftAccountState>(null!);
export function NftAccountProvidr({ children }: { children: ReactNode }) {
  const workspace = useWorkspace();
  const NftScanner = useNftScanner();
  const [selectedNft, setSelectedNft] = useState<nftInfo>(null!);
  const [nftConfigPdaAccount, setNftConfigPdaAccount] = useState<nftConfigPdaAccount>(null!);
  const [postPdaAddressList, setPostPdaAddressList] = useState<PublicKey[]>([]);
  const [rawPostPdaAccountList, setRawPostPdaAccountList] = useState<postPdaAccount[]>([]);
  const [postPdaAccountList, setPostPdaAccountList] = useState<postPdaAccount[]>([]);

  useEffect(() => {
    if (NftScanner.selectedNftId != undefined && workspace) {
      const program = workspace.program;
      setSelectedNft(NftScanner.nftsList[NftScanner.selectedNftId]);
      if (selectedNft) {
        getNftConfigPda(new PublicKey(selectedNft.mint)).then((res) => {
          program.account.nftConfigPda.fetch(res[0].toBase58()).then(async (res) => {
            setNftConfigPdaAccount(res);
          });
        });
      }
    }
  }, [selectedNft, NftScanner]);

  // get all the pda addresses of selectedNft
  useEffect(() => {
    if (nftConfigPdaAccount) {
      const postsNum = nftConfigPdaAccount.postsNum.toNumber();
      for (let i = 0; i < postsNum; i++) {
        getPostPda(nftConfigPdaAccount!.nftMint, i).then((res) => {
          setPostPdaAddressList((prev) => [...prev, new PublicKey(res[0].toBase58())]);
        });
      }
    }
  }, [nftConfigPdaAccount]);

  // get content of post pda
  useEffect(() => {
    if (postPdaAddressList && workspace) {
      // init data
      if (nftConfigPdaAccount.postsNum.toNumber() == postPdaAddressList.length) {
        postPdaAddressList.forEach((pdaAddress) => {
          workspace.program.account.postPda.fetch(pdaAddress).then((postPdaAccount) => {
            setRawPostPdaAccountList((prev) => [...prev, postPdaAccount]);
          });
        });
      }
      // add new tweet after tweeting
      if (rawPostPdaAccountList.length == postPdaAddressList.length - 1) {
        workspace.program.account.postPda
          .fetch(postPdaAddressList[postPdaAddressList.length - 1])
          .then((postPdaAccount) => {
            setRawPostPdaAccountList((prev) => [...prev, postPdaAccount]);
          });
      }
    }
  }, [postPdaAddressList]);

  useEffect(() => {
    if (workspace && rawPostPdaAccountList) {
      let sortByTimestamp = rawPostPdaAccountList.sort((x, y) => {
        return x.timeStamp.toNumber() - y.timeStamp.toNumber();
      });
      setPostPdaAccountList(sortByTimestamp.reverse());
    }
  }, [rawPostPdaAccountList]);

  const value = useMemo(
    () => ({
      selectedNft,
      nftConfigPdaAccount,
      postPdaAddressList,
      rawPostPdaAccountList,
      postPdaAccountList,
      setPostPdaAddressList,
      setRawPostPdaAccountList,
      setPostPdaAccountList,
    }),
    [
      selectedNft,
      nftConfigPdaAccount,
      postPdaAddressList,
      postPdaAccountList,
      setPostPdaAddressList,
      setRawPostPdaAccountList,
      setPostPdaAccountList,
    ]
  );

  return <NftAccountContext.Provider value={value}>{children}</NftAccountContext.Provider>;
}

export default NftAccountContext;
