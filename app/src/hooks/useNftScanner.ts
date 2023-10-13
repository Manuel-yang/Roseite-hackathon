import { useContext } from "react";
import NftScannerContext from "../contexts/NftScannerContext";

export default function useNftScanner() {
  const context = useContext(NftScannerContext);
  if (typeof context === "undefined") {
    throw new Error("useTweets must be used within a TweetsProvider");
  }

  return context;
}
