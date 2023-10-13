import { useContext } from "react";
import CommentsContext from "../contexts/CommentsContext";

export default function useComments() {
  const context = useContext(CommentsContext);
  if (typeof context === "undefined") {
    throw new Error("useComments must be used within a CommentsProvider");
  }

  return context;
}
