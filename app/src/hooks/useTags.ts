import { useContext } from "react";
import TagsContext from "../contexts/TagsContext";

export default function useTags() {
  const context = useContext(TagsContext);
  if (typeof context === "undefined") {
    throw new Error("useTags must be used within a TagsProvider");
  }

  return context;
}