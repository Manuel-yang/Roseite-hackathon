import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import useWorkspace from "../hooks/useWorkspace";
import { MetadataKey } from "@nfteyez/sol-rayz/dist/config/metaplex";

export type nftInfo = {
  mint: string;
  updateAuthority: string;
  data: {
    creators: any[];
    name: string;
    metadata?: any;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
  };
  key: MetadataKey;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number;
  masterEdition?: string;
  edition?: string;
};

interface NftsContextState {
  nftsList: nftInfo[];
  nftLoading: boolean;
  selectedNftId: number | undefined;
  setSelectedNftId: (id: number | undefined) => void;
}

const NftScannerContext = createContext<NftsContextState>(null!);

export function NftScannerProvider({ children }: { children: ReactNode }) {
  const [nftsList, setNftsList] = useState<nftInfo[]>([]);
  const [selectedNftId, setSelectedNftId] = useState<number | undefined>();
  const [nftLoading, setNftLoading] = useState(false);

  const workspace = useWorkspace();

  useEffect(() => {
    if (workspace) {
      setNftLoading(true);
      getParsedNftAccountsByOwner({
        publicAddress: workspace.wallet.publicKey.toBase58(),
        connection: workspace.connection,
      }).then((nfts) => {
        nfts.map((nft) => {
          if (nft.data.symbol == "RSI") {
            getNftMetadata(nft).then((metadata) => {
              let tempNft = nft as nftInfo;
              tempNft.data.metadata = metadata;
              setNftsList((prevNfts) => {
                const isNftExists = prevNfts.some((nft) => nft.data.name === tempNft.data.name);
                if (!isNftExists) {
                  return [...prevNfts, tempNft];
                }
                return prevNfts;
              });
            });
          }
        });
        setNftLoading(false);
      });
    } else {
      setNftLoading(false);
    }
  }, [workspace]);

  const getNftMetadata = async (nft: nftInfo) => {
    const response = await fetch(nft.data.uri);
    const nftMetadata = await response.json();
    return nftMetadata;
  };

  const value = useMemo(
    () => ({
      nftsList,
      nftLoading,
      selectedNftId,
      setSelectedNftId,
    }),
    [nftsList, nftLoading, selectedNftId, setSelectedNftId]
  );

  return <NftScannerContext.Provider value={value}>{children}</NftScannerContext.Provider>;
}

export default NftScannerContext;
