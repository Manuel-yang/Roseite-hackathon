import Link from "next/link";
import useWorkspace from "../hooks/useWorkspace";
import { Tweet } from "../models";

export default function RecentTweets({ tweets }: { tweets: Tweet[] }) {
  const workspace = useWorkspace();
  const owner = workspace && workspace.wallet.publicKey.toBase58();

  return (
    <div className="h-full overflow-y-auto pl-2">
      <ol className="relative border-l border-skin-primary">
        {tweets.map((tweet, i) => {
          const userRoute = tweet.user.toBase58() === owner ? "/profile" : `/users/${tweet.user.toBase58()}`;
          return (
            <li key={i} className="ml-4 mb-4">
              <div className="absolute w-3 h-3 bg-fill-third rounded-full mt-1.5 -left-1.5"></div>
              <div className="relative mb-4 text-left">
                {/* <time className="mb-1 leading-none">
                  <a className="text-sm text-color-third hover:underline">{tweet.created_ago}</a>
                </time> */}
                <div>
                  {/* <Link href={userRoute}> */}
                  <a className="font-bold hover:underline text-color-primary">{tweet.user_display}</a>
                  {/* </Link> */}
                  <span className="text-color-third ml-1">posted</span>
                </div>
                <div className="truncate text-color-secondary">{tweet.content}</div>
                <div>
                  {/* <Link href={`/tags/${tweet.tag}`}>
                    <a className="text-primary-500 transition-colors hover:underline">
                      {`#${tweet.tag}`}
                    </a>
                  </Link> */}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
