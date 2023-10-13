import { PublicKey } from "@solana/web3.js";
import { Tweet } from "../models";
import { AliasProps } from "../pages/api/alias";

export const getPagination = (
  perPage: number,
  prefetchCb: () => Promise<{ pubkeys: PublicKey[]; aliasObj: AliasProps }>,
  pageCb: (page: number, pubkeys: PublicKey[]) => Promise<Tweet[]>
) => {
  let allPublicKeys: PublicKey[] = [];
  let aliasObj: AliasProps = {};

  let prefetchPromise: Promise<void>;

  const prefetch = () => {
    prefetchPromise = (async () => {
      const result = await prefetchCb();
      allPublicKeys = result.pubkeys;
      aliasObj = result.aliasObj;
    })();

    return prefetchPromise;
  };

  const getPagePublicKeys = (page: number) => {
    return allPublicKeys.slice((page - 1) * perPage, page * perPage);
  };

  const hasPage = (page: number) => {
    return getPagePublicKeys(page).length > 0;
  };

  const getPage = async (page: number) => {
    await prefetchPromise;
    if (!hasPage(page)) return [];
    return await pageCb(page, getPagePublicKeys(page));
  };

  const getAliasObj = () => aliasObj;

  return {
    getAliasObj,
    getPagePublicKeys,
    hasPage,
    getPage,
    prefetch,
  };
};
