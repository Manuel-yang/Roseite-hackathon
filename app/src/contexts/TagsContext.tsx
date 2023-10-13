import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import useWorkspace from "../hooks/useWorkspace";
import { TagType } from "../models";
// import { fetchTags } from "../pages/api/tweets";

interface TagsContextState {
  tags: TagType[];
  recentTags: TagType[];
  loading: boolean;
}

const TagsContext = createContext<TagsContextState>(null!);

export function TagsProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState<TagType[]>([]);
  const [recentTags, setRecentTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);

  const workspace = useWorkspace();

  // useEffect(() => {
  //   if (workspace) {
  //     setLoading(true);
  //     fetchTags(workspace)
  //       .then((data) => {
  //         setTags(data);
  //         const recentOrdered = data
  //           .sort((a, b) => b.timestamp - a.timestamp)
  //           .slice(0, 5);
  //         setRecentTags(recentOrdered);
  //       })
  //       .finally(() => setLoading(false));
  //   } else {
  //     setTags([]);
  //     setRecentTags([]);
  //     setLoading(false);
  //   }
  // }, [workspace]);

  const value = useMemo(
    () => ({
      tags,
      recentTags,
      loading,
    }),
    [tags, recentTags, loading]
  );

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
}

export default TagsContext;
