import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import useTheme from "../hooks/useTheme";
import Loader from "../components/Loader";
import { nftInfo } from "../contexts/NftScannerContext";

interface NftSelectModalProps {
  isShow: boolean;
  loading: boolean;
  nfts: nftInfo[];
  close: () => void;
  confirm: (id: number | undefined) => void;
}

export default function NftSelectModal({ isShow, loading, nfts, close, confirm }: NftSelectModalProps) {
  const [selectingId, setSelectingId] = useState<number>();
  const { theme } = useTheme();

  return (
    <Modal show={isShow} onClose={close}>
      <Modal.Header>Select your NFT Account</Modal.Header>
      <Modal.Body>
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-4 gap-2">
            {loading ? (
              <Loader />
            ) : (
              nfts.map((nft, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center mb-4 ${selectingId === index ? "selected" : ""}`}
                >
                  <img
                    className={`w-32 h-32 rounded-lg mb-1 ${selectingId === index ? "border-4 border-blue-500" : ""}`}
                    src={nft.data.metadata.image}
                    alt={nft.data.name}
                    onClick={() => {
                      setSelectingId(index);
                    }}
                  />
                  <span className={`text-sm ${theme === "dark" ? "text-white" : ""}`}>{nft.data.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {selectingId !== undefined ? (
          <>
            <div className={`w-1/2 ${theme === "dark" ? "text-white" : ""}`}>
              <p>Select NFT: {nfts[selectingId]?.data.name}</p>
            </div>
            <div className="w-1/2">
              <Button
                onClick={() => {
                  confirm(selectingId);
                  close();
                }}
              >
                Confirm
              </Button>
            </div>
          </>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}
