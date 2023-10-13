import { PublicKey } from "@solana/web3.js";
import TextareaAutosize from "react-autosize-textarea/lib";
import { SubmitHandler, useForm } from "react-hook-form";
import { CONTENT_LIMIT } from "../constants";
import useComments from "../hooks/useComments";
import { useCountCharacterLimit } from "../hooks/useCountCharacterLimit";
import useTheme from "../hooks/useTheme";
import { Comment } from "../models/Comment";
import { notifyLoading, notifyUpdate } from "../utils";

type FormValues = {
  content: string;
};

export default function CommentForm({
  tweet,
  added,
  onClose,
}: {
  tweet: PublicKey;
  added: (a: Comment) => void;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const { sendComment } = useComments();
  const { register, resetField, handleSubmit, watch } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => send(data);

  // Character limit / count-down
  const characterLimit = useCountCharacterLimit(watch("content"));
  let characterLimitColor = "text-color-third";
  if (CONTENT_LIMIT - characterLimit <= 10)
    characterLimitColor = "text-yellow-500";
  if (CONTENT_LIMIT - characterLimit < 0) characterLimitColor = "text-red-500";

  const canComment = watch("content") && CONTENT_LIMIT - characterLimit > 0;

  const send = async (data: FormValues) => {
    if (!canComment) return;
    const toastId = notifyLoading(
      "Transaction in progress. Please wait...",
      theme
    );
    const result = await sendComment(tweet, data.content);
    notifyUpdate(toastId, result.message, result.comment ? "success" : "error");
    if (result.comment) {
      added(result.comment);
      resetField("content");
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t border-skin-primary mt-4 mx-4 px-4 pt-4"
    >
      <TextareaAutosize
        {...register("content", {
          required: true,
          maxLength: CONTENT_LIMIT,
        })}
        id="content"
        rows={1}
        className="mb-3 w-full resize-none text-lg text-color-secondary"
        placeholder="Add Comment..."
      />
      <div className="-m-2 flex flex-wrap items-center justify-between">
        <div className="m-1 ml-auto flex items-center space-x-4">
          {/* <!-- Character limit. --> */}
          <div className="text-sm">
            <span className={characterLimitColor}>{characterLimit}</span>
            <span className="text-color-secondary">{` / ${CONTENT_LIMIT}`}</span>
          </div>
          {/* <!-- Cancel button. --> */}
          <button
            className="rounded-full px-4 py-2 font-semibold bg-fill-third text-color-primary"
            onClick={onClose}
          >
            Cancel
          </button>
          {/* <!-- Send button. --> */}
          <button
            disabled={!canComment}
            className={
              (canComment
                ? "bg-primary-500 "
                : "bg-primary-300/80 cursor-not-allowed ") +
              "rounded-full px-4 py-2 font-semibold text-white"
            }
            type="submit"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}
