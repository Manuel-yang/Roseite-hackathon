import Link from "next/link";
import { TagType } from "../models";

export default function RecentTags({tags}: {tags: TagType[]}) {
  return (
    <div className="h-full overflow-y-auto pl-2">
      <ol className="relative border-l border-skin-primary">
        {tags.map((tag, i) => (
          <li key={i} className="ml-4 mb-4">
            <div className="absolute w-3 h-3 bg-fill-third rounded-full mt-1.5 -left-1.5"></div>
            <div className="relative mb-4 text-left">
              <time className="mb-1 leading-none">
                <Link href={`/tweets/${tag.tweetKey}`}>
                  <a className="text-sm text-color-secondary hover:underline">
                    {tag.created_ago}
                  </a>
                </Link>
              </time>
              <div>
                <Link href={`/tags/${tag.tag}`}>
                  <a className="text-primary-500 transition-colors hover:underline">
                    {`#${tag.tag}`}
                  </a>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}