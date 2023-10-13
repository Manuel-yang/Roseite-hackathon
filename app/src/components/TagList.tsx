import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { TagType } from "../models";
import Loader from "./Loader";

interface TagListProps {
  tags: TagType[];
  loading: boolean;
}

export default function TagList(props: TagListProps) {
  const { tags, loading } = props;
  const { connected } = useWallet();

  return (
    <>
      {connected ? (
        loading ? (
          <Loader />
        ) : (
          <div className="flex flex-wrap m-4">
            {tags
              .sort((a, b) => b.count - a.count)
              .map((tag, i) => (
                <TagBadge key={i} tag={tag} />
              ))}
          </div>
        )
      ) : (
        <div className="border-b border-skin-primary bg-fill-secondary px-8 py-4 text-center text-color-third">
          Connect your wallet to start tweeting...
        </div>
      )}
    </>
  );
}

function TagBadge({ tag }: { tag: TagType }) {
  return (
    <div className="border border-sky-500 rounded-full mb-2 mr-2">
      <Link href={`/tags/${tag.tag}`}>
        <a className="text-primary-500 text-sm hover:underline px-2 py-0">
          {`#${tag.tag}`}
          <span className="text-color-secondary ml-2">{tag.count}</span>
        </a>
      </Link>
    </div>
  );
}
