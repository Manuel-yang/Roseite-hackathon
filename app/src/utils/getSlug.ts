export const getSlug = (text: string) => {
  if (text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9 - []]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  return "";
};
