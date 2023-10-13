import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiHashtag } from "react-icons/hi";
import TagList from "../../components/TagList";
import { TagType } from "../../models";
import TweetSearch from "../../components/TweetSearch";
import Base from "../../templates/Base";
import RecentTags from "../../components/RecentTags";
import { useSlug } from "../../hooks/useSlug";
import useTags from "../../hooks/useTags";

export default function Tags() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [filterTags, setFilterTags] = useState<TagType[]>([]);

  const { tags, recentTags, loading } = useTags();
  const slugTag = useSlug(tag);

  useEffect(() => {
    setFilterTags(tags);
  }, [tags]);

  const onTextChange = (text: string) => {
    const fTags = tags.filter((k) => k.tag.includes(text));
    setTag(text);
    setFilterTags(fTags);
  };

  const search = (str: string) => {
    router.push(`/tags/${str}`);
  };

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Tags
            </h2>
          </div>
          <TweetSearch
            placeholder="tag"
            disabled={!slugTag}
            modelValue={slugTag}
            setModelValue={onTextChange}
            search={search}
          >
            <HiHashtag size={20} className="text-color-third" />
          </TweetSearch>
          <TagList tags={filterTags} loading={loading} />
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">
              Recent Tags
            </h3>
            <RecentTags tags={recentTags} />
          </div>
        </div>
      </div>
    </Base>
  );
}
