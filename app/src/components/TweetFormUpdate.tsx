import Link from "next/link";
import { useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiHashtag } from "react-icons/hi";
import { CONTENT_LIMIT, TAG_LIMIT } from "../constants";
import { useCountCharacterLimit } from "../hooks/useCountCharacterLimit";
import { useSlug } from "../hooks/useSlug";
import useTheme from "../hooks/useTheme";
import useTweets from "../hooks/useTweets";
import { Tweet } from "../models";
import { notifyLoading, notifyUpdate } from "../utils";

type FormValues = {
  content: string;
  tag: string;
};

export default function TweetFormUpdate({
  tweet,
  onClose,
}: {
  tweet: Tweet;
  onClose: () => void;
}) {
  const { updateTweet } = useTweets();
  const { theme } = useTheme();
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      content: tweet.content,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => update(data);

  // Form data
  const [tag, setTag] = useState<string>(tweet.tag);
  const slugTag = useSlug(tag);

  // Character limit / count-down
  const characterLimit = useCountCharacterLimit(watch("content"));
  let characterLimitColor = "text-color-third";
  if (CONTENT_LIMIT - characterLimit <= 10)
    characterLimitColor = "text-yellow-500";
  if (CONTENT_LIMIT - characterLimit < 0) characterLimitColor = "text-red-500";

  // Permissions
  const canTweet =
    watch("content") &&
    CONTENT_LIMIT - characterLimit > 0 &&
    (tweet.tag !== slugTag || tweet.content !== watch("content"));

  // Actions
  const update = async (data: FormValues) => {
    if (!canTweet) return;
    const toastId = notifyLoading(
      "Transaction in progress. Please wait...",
      theme
    );
    const result = await updateTweet(tweet, slugTag, data.content);
    notifyUpdate(toastId, result.message, result.success ? "success" : "error");
    if (result) {
      onClose();
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2">
        <h3
          className="inline font-semibold text-color-primary"
          title={tweet.user_display}
        >
          <Link href="/profile">
            <a className="hover:underline">{tweet.user_display}</a>
          </Link>
        </h3>
        <span className="text-color-secondary">•</span>
        <time className="text-sm text-color-secondary" title={tweet.created_at}>
          <Link href={`/tweets/${tweet.key}`}>
            <a className="hover:underline">{tweet.created_ago}</a>
          </Link>
        </time>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
        {/* <!-- Content field. --> */}
        <TextareaAutosize
          {...register("content", {
            required: true,
            maxLength: CONTENT_LIMIT,
          })}
          id="content"
          rows={1}
          className="mb-3 w-full resize-none text-xl text-color-secondary"
          placeholder="What's happening?"
        />
        <div className="-m-2 flex flex-wrap items-center justify-between">
          {/* <!-- Topic field. --> */}
          <div className="relative m-2 mr-4">
            <input
              {...register("tag", { maxLength: TAG_LIMIT })}
              onChange={(e) => setTag(e.target.value)}
              value={slugTag}
              type="text"
              placeholder="tag"
              className="text-primary-500 rounded-full bg-fill-secondary border-transparent py-2 pl-10 pr-4"
              disabled={!slugTag}
            />
            <div className="absolute inset-y-0 left-0 flex pl-3 pr-2">
              <HiHashtag
                size={20}
                className={
                  (slugTag ? "text-primary-500 " : "text-color-third ") +
                  "m-auto"
                }
              />
            </div>
          </div>
          <div className="m-2 ml-auto flex items-center space-x-4">
            {/* <!-- Character limit. --> */}
            <div className="text-sm">
              <span className={characterLimitColor}>{characterLimit}</span>
              <span className="text-color-secondary">{` / ${CONTENT_LIMIT}`}</span>
            </div>
            {/* <!-- Tweet button. --> */}
            <button
              onClick={onClose}
              className="rounded-full px-4 py-2 font-semibold text-color-primary bg-fill-third"
            >
              Close
            </button>
            <button
              disabled={!canTweet}
              className={
                (canTweet
                  ? "bg-primary-500 "
                  : "bg-primary-300/80 cursor-not-allowed ") +
                "rounded-full px-4 py-2 font-semibold text-white"
              }
              type="submit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
