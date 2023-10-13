import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiHashtag } from "react-icons/hi";
import { CONTENT_LIMIT, TAG_LIMIT } from "../constants";
import { useCountCharacterLimit } from "../hooks/useCountCharacterLimit";
import { useSlug } from "../hooks/useSlug";
import useTheme from "../hooks/useTheme";
import useTweets from "../hooks/useTweets";
import { notifyLoading, notifyUpdate } from "../utils";
import JSConfetti from "js-confetti";

type FormValues = {
  content: string;
  tag: string;
};

export default function TweetForm({ forceTag }: { forceTag?: string }) {
  const jsConfetti = new JSConfetti();
  const { sendTweet } = useTweets();
  const { connected } = useWallet();
  const { theme } = useTheme();
  const { register, resetField, handleSubmit, watch } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => send(data);

  // Form data
  const [tag, setTag] = useState<string>("");
  const slugTag = useSlug(tag);
  const effectiveTag = forceTag ?? slugTag;

  // Character limit / count-down
  const characterLimit = useCountCharacterLimit(watch("content"));
  let characterLimitColor = "text-color-third";
  if (CONTENT_LIMIT - characterLimit <= 10) characterLimitColor = "text-yellow-500";
  if (CONTENT_LIMIT - characterLimit < 0) characterLimitColor = "text-red-500";

  // Permissions
  const canTweet = watch("content") && CONTENT_LIMIT - characterLimit > 0;

  // Actions
  const send = async (data: FormValues) => {
    if (!canTweet) return;
    const toastId = notifyLoading("Transaction in progress. Please wait...", theme);
    // console.log(data)
    jsConfetti.addConfetti({
      emojiSize: 20,
      confettiNumber: 120,
    });
    const result = await sendTweet(effectiveTag, data.content);
    notifyUpdate(toastId, result.message, result.tweet ? "success" : "error");

    // if (result.tweet) {
    //   resetField("content");
    //   setTag("");
    // }
  };

  return (
    <>
      {connected ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 border-b border-skin-primary px-8 py-4">
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
                value={effectiveTag}
                type="text"
                placeholder="tag"
                className="text-primary-500 rounded-full bg-fill-secondary border-transparent y-2 pl-10 pr-4"
                disabled={!!forceTag}
                autoComplete="off"
              />
              <div className="absolute inset-y-0 left-0 flex pl-3 pr-2">
                <HiHashtag
                  size={20}
                  className={(effectiveTag ? "text-primary-500 " : "text-color-third ") + "m-auto"}
                />
              </div>
            </div>
            <div className="m-2 ml-auto flex items-center space-x-6">
              {/* <!-- Character limit. --> */}
              <div className="text-sm">
                <span className={characterLimitColor}>{characterLimit}</span>
                <span className="text-color-secondary">{` / ${CONTENT_LIMIT}`}</span>
              </div>
              {/* <!-- Tweet button. --> */}
              <button
                disabled={!canTweet}
                className={
                  (canTweet ? "bg-primary-500 " : "bg-primary-300/80 cursor-not-allowed ") +
                  "rounded-full px-4 py-2 font-semibold text-white"
                }
                type="submit"
              >
                Tweet
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="border-b border-skin-primary bg-curent px-8 py-4 text-center text-color-secondary">
          Connect your wallet to start tweeting...
        </div>
      )}
    </>
  );
}
