import { useEffect, useState } from "react";

export const useCountCharacterLimit = (text: string) => {
  if (text === undefined) text = "";
  const [characterLimit, setCharacterLimit] = useState(0);
  useEffect(() => setCharacterLimit(text.length), [text]);

  return characterLimit;
};
