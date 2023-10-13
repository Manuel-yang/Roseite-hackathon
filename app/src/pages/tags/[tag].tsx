import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiHashtag } from "react-icons/hi";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { tagFilter } from "../api/tweets";
import Base from "../../templates/Base";
import TweetSearch from "../../components/TweetSearch";
import RecentTags from "../../components/RecentTags";
import useTweets from "../../hooks/useTweets";
import useTags from "../../hooks/useTags";
import { getSlug } from "../../utils";
import useWorkspace from "../../hooks/useWorkspace";

export default function Tags() {
  const router = useRouter();
  const [tag, setTag] = useState<string>("");
  const [viewedTag, setViewedTag] = useState<string>("");

  const workspace = useWorkspace();
  const { tweets, loading, hasMore, loadMore, prefetch, deleteTweet } =
    useTweets();
  const { recentTags } = useTags();

  const search = (str: string) => {
    router.push(`/tags/${str}`);
  };

  useEffect(() => {
    const slugTag = getSlug(router.query.tag as string);
    setTag(slugTag);
  }, [router.query.tag]);

  useEffect(() => {
    if (workspace) {
      if (tag === viewedTag) return;
      const filters = [tagFilter(tag)];
      prefetch(filters);
      setViewedTag(tag);
    } else {
      setViewedTag("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag, workspace]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Tweets with Tag
            </h2>
          </div>
          <TweetSearch
            placeholder="tag"
            disabled={!tag}
            modelValue={tag}
            search={search}
          >
            <HiHashtag size={20} className="text-color-third" />
          </TweetSearch>
          <TweetForm forceTag={tag} />
          {workspace ? (
            <TweetList
              tweets={tweets}
              loading={loading}
              hasMore={hasMore}
              loadMore={loadMore}
              deleteTweet={deleteTweet}
            />
          ) : null}
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">
              Recent Tags
            </h3>
            {workspace ? <RecentTags tags={recentTags} /> : null}
          </div>
        </div>
      </div>
    </Base>
  );
}
