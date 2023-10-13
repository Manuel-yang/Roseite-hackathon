import { PublicKey } from "@solana/web3.js";
import { createContext, ReactNode, useCallback, useMemo } from "react";
import useWorkspace from "../hooks/useWorkspace";
import { Comment } from "../models/Comment";
import {
  deleteComment,
  sendComment,
  updateComment,
} from "../pages/api/comments";

interface CommentsContextState {
  sendComment(
    tweetKey: PublicKey,
    content: string
  ): Promise<{ comment: Comment | null; message: string }>;
  updateComment(
    commentKey: PublicKey,
    content: string
  ): Promise<{ success: boolean; message: string }>;
  deleteComment(
    commentKey: PublicKey
  ): Promise<{ success: boolean; message: string }>;
}

const CommentsContext = createContext<CommentsContextState>(null!);

export function CommentsProvider({ children }: { children: ReactNode }) {
  const workspace = useWorkspace();

  const _sendComment = useCallback(
    async (tweetKey: PublicKey, content: string) => {
      if (workspace) {
        const result = await sendComment(workspace, tweetKey, content);
        return result;
      } else {
        return { comment: null, message: "Connect wallet to send comment..." };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace]
  );

  const _updateComment = useCallback(
    async (commentKey: PublicKey, content: string) => {
      if (workspace) {
        const result = await updateComment(workspace, commentKey, content);
        return result;
      } else {
        return {
          success: false,
          message: "Connect wallet to update comment...",
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace]
  );

  const _deleteComment = useCallback(
    async (commentKey: PublicKey) => {
      if (workspace) {
        const result = await deleteComment(workspace, commentKey);
        return result;
      } else {
        return { success: false, message: "Connect wallet to delete comment" };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace]
  );

  const value = useMemo(
    () => ({
      sendComment: _sendComment,
      updateComment: _updateComment,
      deleteComment: _deleteComment,
    }),
    [_deleteComment, _sendComment, _updateComment]
  );

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
}

export default CommentsContext;
