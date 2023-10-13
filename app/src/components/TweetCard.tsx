import Link from "next/link";
import { useState } from "react";
import {
  HiOutlinePencilAlt,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import useWorkspace from "../hooks/useWorkspace";
import { Tweet } from "../models";
import { Comment } from "../models/Comment";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import TweetFormUpdate from "./TweetFormUpdate";
import { Avatar } from "flowbite-react";

export default function TweetCard({
  tweet,
  onDelete,
}: {
  tweet: Tweet;
  onDelete: (t: Tweet) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);

  const workspace = useWorkspace();
  const userRoute =
    workspace && workspace.wallet.publicKey.toBase58() === tweet.user.toBase58()
      ? "/profile"
      : `/users/${tweet.user.toBase58()}`;
  const isOwner: boolean = workspace
    ? workspace.wallet.publicKey.toBase58() === tweet.user.toBase58()
    : false;

  const addComment = (comment: Comment) => {
    tweet.comments = [comment, ...tweet.comments];
  };

  return (
    <>
      {isEditing ? (
        <TweetFormUpdate onClose={() => setIsEditing(false)} tweet={tweet} />
      ) : (
        <div className="px-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="mr-2">
              <Link href={userRoute}>
                <a>
                  <Avatar
                    img={`https://avatars.dicebear.com/api/jdenticon/${tweet.user.toBase58()}.svg`}
                    size="md"
                    rounded={true}
                  />
                </a>
              </Link>
            </div>
            <h3
              className="inline font-semibold text-color-primary"
              title={tweet.user_display}
            >
              <Link href={userRoute}>
                <a className="hover:underline">{tweet.user_display}</a>
              </Link>
            </h3>
            <span className="text-color-secondary">•</span>
            <time
              className="text-sm text-color-secondary"
              title={tweet.created_at}
            >
              <Link href={`/tweets/${tweet.key}`}>
                <a className="hover:underline">{tweet.created_ago}</a>
              </Link>
            </time>
            {tweet.state && (
              <HiOutlinePencilAlt className="text-color-third" size={16} />
            )}
          </div>
          <div className="ml-12 border-b border-skin-primary pb-4">
            <div className="flex flex-col py-4 px-8 border border-skin-primary rounded-lg bg-fill-secondary">
              <p className="whitespace-pre-wrap text-color-secondary">
                {tweet.content}
              </p>
              <div className="flex">
                {tweet.tag && tweet.tag !== "[untagged]" && (
                  <Link href={`/tags/${tweet.tag}`}>
                    <a className="text-primary-500 inline-block mt-2 hover:underline">
                      {`#${tweet.tag}`}
                    </a>
                  </Link>
                )}
                <div className="flex items-center space-x-1 ml-auto">
                  {isOwner && (
                    <button
                      onClick={() => onDelete(tweet)}
                      title="Delete tweet"
                    >
                      <HiOutlineTrash
                        className="m-1 text-color-third hover:text-primary-500"
                        size={20}
                      />
                    </button>
                  )}
                  {isOwner && (
                    <button
                      title="Update tweet"
                      onClick={() => setIsEditing(true)}
                    >
                      <HiOutlinePencil
                        className="m-1 text-color-third hover:text-primary-500"
                        size={20}
                      />
                    </button>
                  )}
                  <button
                    title="Add Comment"
                    onClick={() => setIsCommentEditing(true)}
                  >
                    <HiOutlineChatAlt2
                      className="m-1 text-color-third hover:text-primary-500"
                      size={20}
                    />
                  </button>
                </div>
              </div>
              {isCommentEditing && (
                <CommentForm
                  tweet={tweet.publickey}
                  onClose={() => setIsCommentEditing(false)}
                  added={addComment}
                />
              )}
              {tweet.comments.length > 0 &&
                tweet.comments.map((comment, i) => (
                  <CommentCard key={i} comment={comment} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
