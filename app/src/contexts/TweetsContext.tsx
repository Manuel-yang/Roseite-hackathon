import { PublicKey } from "@solana/web3.js";
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import useWorkspace from "../hooks/useWorkspace";
import { Tweet } from "../models";
import { sendTweet } from "../pages/api/tweets";
// import { deleteTweet, getTweet, paginateTweets, sendTweet, updateTweet } from "../pages/api/tweets";
import useNftAccount from "../hooks/useNftAccount";

interface TweetsContextState {
  tweets: Tweet[];
  recentTweets: Tweet[];
  loading: boolean;
  hasMore: boolean;
  prefetch(filters: any[]): void;
  loadMore(): void;
  sendTweet(tag: string, content: string): Promise<{ tweet: Tweet | null; message: string }>;
  // updateTweet(tweet: Tweet, tag: string, content: string): Promise<{ success: boolean; message: string }>;
  deleteTweet(tweetKey: PublicKey): Promise<{ success: boolean; message: string }>;
  // getTweet(pubkey: PublicKey): Promise<Tweet | null>;
}

const TweetsContext = createContext<TweetsContextState>(null!);

export function TweetsProvider({ children }: { children: ReactNode }) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [recentTweets, setRecentTweets] = useState<Tweet[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const workspace = useWorkspace();
  const {selectedNft, postPdaAddressList, setPostPdaAddressList} = useNftAccount();
  const onNewPage = (newTweets: Tweet[], more: boolean) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setLoading(false);
    setHasMore(more);
  };
  
  useEffect(() => {
    if (!workspace) {
      setPagination(null);
      setTweets([]);
      setRecentTweets([]);
      setLoading(false);
    }
  }, [workspace]);

  useEffect(() => {
    if (pagination) {
      console.log("call useEffect tweets pagination");
      setLoading(true);
      pagination.prefetch().then(pagination.getNextPage);
    }
  }, [pagination]);


  useEffect(() => {
    setRecentTweets(tweets.slice(0, 5));
  }, [tweets]);

  const _sendTweet = useCallback(
    async (tag: string, content: string) => {
      if (workspace && selectedNft) {
        const nftMintAddress = new PublicKey(selectedNft.mint);
        let result = await sendTweet(workspace, nftMintAddress, content);
        if (result.tweet) {
          setPostPdaAddressList((prev: PublicKey[]): PublicKey[] => [...prev, result.postPdaAddress]);
          setTweets((prev) => [result.tweet, ...prev]);
        }
        return result;
      } else {
        return { tweet: null, message: "Connect wallet to starting tweet..." };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace, selectedNft, postPdaAddressList]
  );
  // const _updateTweet = useCallback(
  //   async (tweet: Tweet, tag: string, content: string) => {
  //     if (workspace) {
  //       const result = await updateTweet(workspace, tweet, tag, content);
  //       return result;
  //     } else {
  //       return {
  //         success: false,
  //         message: "Connect wallet to update tweet...",
  //       };
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [workspace]
  // );

  const _deleteTweet = useCallback(
    async (tweetKey: PublicKey) => {
      // if (workspace) {
      //   const result = await deleteTweet(workspace, tweetKey);
      //   if (result.success) {
      //     setTweets((prev) => prev.filter((t) => t.publickey.toBase58() !== tweetKey.toBase58()));
      //   }
      //   return result;
      // } else {
      return {
        success: false,
        message: "Connect wallet to delete tweet...",
      };
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tweets, workspace]
  );

  // const getTweetFromPublicKey = useCallback(
  //   async (publickey: PublicKey) => {
  //     if (workspace) {
  //       const tweet = await getTweet(workspace, publickey);
  //       return tweet;
  //     }
  //     return null;
  //   },
  //   [workspace]
  // );

  // const prefetch = useCallback(
  //   (filters: any[]) => {
  //     if (workspace) {
  //       setTweets([]);
  //       setRecentTweets([]);
  //       const newPagination = paginateTweets(workspace, filters, 10, onNewPage);
  //       setPagination(newPagination);
  //     }
  //   },
  //   [workspace]
  // );

  const prefetch = useCallback(
    (filters: any[]) => {
      if (workspace) {
        setTweets([]);
        setRecentTweets([]);
      }
    },
    [workspace]
  );

  const loadMore = useCallback(() => {
    if (pagination) {
      setLoading(true);
      pagination.getNextPage();
    }
  }, [pagination]);

  const value = useMemo(
    () => ({
      tweets,
      recentTweets,
      loading,
      hasMore,
      prefetch,
      loadMore,
      sendTweet: _sendTweet,
      // updateTweet: _updateTweet,
      deleteTweet: _deleteTweet,
      // getTweet: getTweetFromPublicKey,
    }),
    [
      tweets,
      recentTweets,
      loading,
      hasMore,
      prefetch,
      loadMore,
      _sendTweet,
      // _updateTweet,
      _deleteTweet,
      // getTweetFromPublicKey,
    ]
  );

  return <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>;
}

export default TweetsContext;
