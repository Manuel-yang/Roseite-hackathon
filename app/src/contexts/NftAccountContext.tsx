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
  postPdaAddress: PublicKey,
  postId: BN,
  content: string;
  likeNum: BN;
  nftAddress: PublicKey;
  reviewNum: BN;
  timeStamp: BN;
  status: number;
};

interface NftAccountState {
  selectedNft: nftInfo;
  nftConfigPdaAccount: nftConfigPdaAccount;
  postPdaAddressList: PublicKey[];
  rawPostPdaAccountList: postPdaAccount[];
  postPdaAccountList: postPdaAccount[];
  setPostPdaAddressList: React.Dispatch<React.SetStateAction<PublicKey[]>>;
  setRawPostPdaAccountList: React.Dispatch<React.SetStateAction<postPdaAccount[]>>;
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
  // init all the post data
  useEffect(() => {
    const fetchPostPdaAddressList = async () => {
      if (nftConfigPdaAccount && workspace) {
        const postsNum = nftConfigPdaAccount.postsNum.toNumber();
        if (postsNum != postPdaAddressList.length) {
          for (let i = 0; i < postsNum; i++) {
            let res = await getPostPda(nftConfigPdaAccount!.nftMint, i)
            setPostPdaAddressList((prev) => [...prev, res[0]]);
            workspace.program.account.postPda
            .fetch(res[0])
            .then((postPdaAccount) => {
              let tempPostPdaAccount = postPdaAccount as unknown as postPdaAccount
              tempPostPdaAccount.postPdaAddress = res[0]
              setRawPostPdaAccountList((prev) => [...prev, tempPostPdaAccount]);
            });
          }
        }
      }
    }
    fetchPostPdaAddressList()
  }, [workspace, nftConfigPdaAccount]);

  // // list all the post which status is post by time
  useEffect(() => {
    if (workspace && rawPostPdaAccountList) {
      let sortByTimestamp = rawPostPdaAccountList.sort((x, y) => {
        return x.timeStamp.toNumber() - y.timeStamp.toNumber();
      });
      sortByTimestamp = sortByTimestamp.filter((postPdaAccount) => {
        return postPdaAccount.status == 0
      })
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
