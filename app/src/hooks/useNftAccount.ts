import { useContext } from "react";
import NftAccountContext from "../contexts/NftAccountContext";

export default function useNftAccount() {
  const context = useContext(NftAccountContext);
  if (typeof context === "undefined") {
    throw new Error("useTweets must be used within a TweetsProvider");
  }

  return context;
}
