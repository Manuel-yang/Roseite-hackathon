import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userFilter } from "../api/tweets";
import TweetList from "../../components/TweetList";
import Base from "../../templates/Base";
import { PublicKey } from "@solana/web3.js";
import RecentUsers from "../../components/RecentUsers";
import useTweets from "../../hooks/useTweets";
import useUsers from "../../hooks/useUsers";
import useWorkspace from "../../hooks/useWorkspace";

export default function User() {
  const router = useRouter();
  const [user, setUser] = useState<string>("");
  const [userAlias, setUserAlias] = useState("");
  const [viewedUser, setViewedUser] = useState("");

  const workspace = useWorkspace();
  const { tweets, loading, hasMore, loadMore, prefetch, deleteTweet } =
    useTweets();
  const { recentUsers, getUserAlias } = useUsers();

  useEffect(() => {
    setUser(router.query.user as string);
  }, [router.query]);

  useEffect(() => {
    if (workspace) {
      if (user === viewedUser) return;
      getUserAlias(new PublicKey(user)).then((value) => setUserAlias(value));
      setViewedUser(user);
      const filters = [userFilter(user)];
      prefetch(filters);
    } else {
      setViewedUser("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, workspace]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              {workspace &&
              user &&
              workspace.wallet.publicKey.toBase58() === user
                ? "Your Tweets"
                : `${userAlias}'s Tweets`}
            </h2>
          </div>
          {workspace ? (
            <TweetList
              tweets={tweets}
              loading={loading}
              hasMore={hasMore}
              loadMore={loadMore}
              deleteTweet={deleteTweet}
            />
          ) : null}
          {workspace && !loading && tweets.length === 0 && (
            <div className="p-8 text-center text-color-third">
              User not found...
            </div>
          )}
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">
              Recent Users
            </h3>
            {workspace ? <RecentUsers users={recentUsers} /> : null}
          </div>
        </div>
      </div>
    </Base>
  );
}
