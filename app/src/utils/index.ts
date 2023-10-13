export * from "./toCapitalize";
export * from "./notify";
export * from "./toCollapse";
export * from "./getPagination";
export * from "./getSlug";
export * from "./bnToData";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
