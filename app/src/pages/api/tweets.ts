// import bs58 from "bs58";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { TagType, Tweet, TweetState, UserType } from "../../models";
// import { sleep } from "../../utils";
// import { web3, utils, Program } from "@project-serum/anchor";
// import { getPagination } from "../../utils";
// import { fetchUsersAlias, getUserAlias } from "./alias";
// import { commentTweetFilter, fetchComments } from "./comments";
// import { AnchorWallet } from "@solana/wallet-adapter-react";

import { PublicKey } from "@metaplex-foundation/js";
import { program } from "@project-serum/anchor/dist/cjs/spl/associated-token";
import { getNftConfigPda, getPostPda, getAssociatedAddress } from "../../utils/pdas";
import useWorkspace, { Workspace } from "../../hooks/useWorkspace";
import { Transaction } from "@solana/web3.js";
import { Tweet } from "../../models";

// export const fetchTweets = async (program: Program, filters: any[] = []) => {
//   const tweets = await program.account.tweet.all(filters);

//   const orderedTweets = tweets
//     .map((tweet) => {
//       return new Tweet(tweet.publicKey, tweet.account);
//     })
//     .filter((tweet) => tweet.tag !== "[deleted]")
//     .sort((a, b) => b.timestamp - a.timestamp);
//   return orderedTweets;
// };

// export const paginateTweets = (
//   { program, connection }: { program: Program; connection: Connection },
//   filters: any[] = [],
//   perPage = 10,
//   onNewPage: (a: Tweet[], b: boolean) => void
// ) => {
//   let page = 0;

//   const prefetchCb = async () => {
//     // Reset page number
//     page = 0;

//     // Prepare the discriminator filter
//     const tweetClient = program.account.tweet;
//     const tweetAccountName = "Tweet";
//     const tweetDiscriminatorFilter = {
//       memcmp: tweetClient.coder.accounts.memcmp(tweetAccountName),
//     };

//     // Prefetch all tweets with their timestamps + state only
//     const allTweets = await connection.getProgramAccounts(program.programId, {
//       filters: [tweetDiscriminatorFilter, ...filters],
//       dataSlice: { offset: 40, length: 8 + 1 },
//     });

//     // Parse the timestamp from the account's data
//     const allTweetsWithTimestamps = allTweets
//       .map(({ account, pubkey }) => ({
//         pubkey,
//         timestamp: account.data.subarray(0, 8).readInt32LE(),
//         state: account.data.subarray(8, 8 + 1).readInt8(),
//       }))
//       .filter((a) => a.state !== TweetState.Deleted);

//     const pubkeys = allTweetsWithTimestamps
//       .sort((a, b) => b.timestamp - a.timestamp)
//       .map(({ pubkey }) => pubkey);

//     // Prefetch user aliases
//     const aliasObj = await fetchUsersAlias(program, connection);

//     return { pubkeys, aliasObj };
//   };

//   const pageCb = async (page: number, paginatedPublicKeys: PublicKey[]) => {
//     const tweets = await program.account.tweet.fetchMultiple(
//       paginatedPublicKeys
//     );

//     return tweets.map((tweet, index) => {
//       return new Tweet(paginatedPublicKeys[index], tweet);
//     });
//   };

//   const pagination = getPagination(perPage, prefetchCb, pageCb);
//   const { hasPage, getPage, getAliasObj } = pagination;

//   const getNextPage = async () => {
//     const aliasObj = getAliasObj();
//     const newPageTweets = await getPage(page + 1);
//     let result: Tweet[] = [];

//     for (let i = 0; i < newPageTweets.length; i++) {
//       let tweet = newPageTweets[i];
//       const [aliasPDA, _] = PublicKey.findProgramAddressSync(
//         [utils.bytes.utf8.encode("user-alias"), tweet.user.toBuffer()],
//         program.programId
//       );
//       if (aliasObj[aliasPDA.toBase58()]) {
//         tweet.user_display = aliasObj[aliasPDA.toBase58()];
//       }
//       const filters = [commentTweetFilter(tweet.key)];
//       const comments = await fetchComments(program, filters, aliasObj);
//       tweet.comments = comments || [];
//       result.push(tweet);
//     }
//     page += 1;
//     const hasNextPage = hasPage(page);
//     onNewPage(result, hasNextPage);
//   };

//   return { page, getNextPage, ...pagination };
// };

// export const getTweet = async (
//   { program, connection }: { program: Program; connection: Connection },
//   publicKey: PublicKey
// ) => {
//   const account = await program.account.tweet.fetch(publicKey);
//   const aliasObj = await fetchUsersAlias(program, connection);
//   const tweet = new Tweet(publicKey, account);
//   const comments = await fetchComments(
//     program,
//     [commentTweetFilter(tweet.key)],
//     aliasObj
//   );
//   tweet.comments = comments || [];
//   return tweet;
// };

// export const sendTweet = async (
//   { program, wallet }: { program: Program; wallet: AnchorWallet },
//   tag: string,
//   content: string
// ) => {
//   const tweet = web3.Keypair.generate();

//   try {
//     await program.methods
//       .sendTweet(tag, content)
//       .accounts({
//         user: wallet.publicKey,
//         tweet: tweet.publicKey,
//         systemPrgram: web3.SystemProgram.programId,
//       })
//       .signers([tweet])
//       .rpc();

//     sleep(2000);
//     const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
//     // @ts-ignore
//     const userKey: PublicKey = tweetAccount.user;
//     const alias = await getUserAlias(program, userKey);
//     return {
//       tweet: new Tweet(tweet.publicKey, tweetAccount, alias),
//       message: "Your tweet was sent successfully!",
//     };
//   } catch (err) {
//     console.error(err);
//     return {
//       tweet: null,
//       // @ts-ignore
//       message: err.toString(),
//     };
//   }
// };

// export const updateTweet = async (
//   { program, wallet }: { program: Program; wallet: AnchorWallet },
//   tweet: Tweet,
//   tag: string,
//   content: string
// ) => {
//   try {
//     await program.methods
//       .updateTweet(tag, content)
//       .accounts({
//         tweet: tweet.publickey,
//         user: wallet.publicKey,
//       })
//       .rpc();

//     tweet.tag = tag;
//     tweet.content = content;
//     tweet.state = TweetState.Edited;
//     return { success: true, message: "Your tweet was updated successfully!" };
//   } catch (err) {
//     console.error(err);
//     // @ts-ignore
//     return { success: false, message: err.toString() };
//   }
// };

// export const deleteTweet = async (
//   { program, wallet }: { program: Program; wallet: AnchorWallet },
//   tweetKey: PublicKey
// ) => {
//   try {
//     await program.methods
//       .deleteTweet()
//       .accounts({
//         tweet: tweetKey,
//         user: wallet.publicKey,
//       })
//       .rpc();

//     return {
//       success: true,
//       message: "Your tweet was deleted successfully!",
//     };
//   } catch (err) {
//     console.error(err);
//     return {
//       success: false,
//       // @ts-ignore
//       message: err.toString(),
//     };
//   }
// };

// export const fetchTags = async ({
//   program,
//   connection,
// }: {
//   program: Program;
//   connection: Connection;
// }) => {
//   // Prepare the discriminator filter
//   const tweetClient = program.account.tweet;
//   const tweetAccountName = "Tweet";
//   const tweetDiscriminatorFilter = {
//     memcmp: tweetClient.coder.accounts.memcmp(tweetAccountName),
//   };

//   // Prefetch all tweets with their timestamp + state + tags only
//   const allTweets = await connection.getProgramAccounts(program.programId, {
//     filters: [tweetDiscriminatorFilter],
//     dataSlice: { offset: 8 + 32, length: 8 + 1 + 4 + 50 * 4 },
//   });

//   const allTags = allTweets
//     .filter(({ account }) => {
//       const state = account.data.subarray(8, 8 + 1).readInt8();
//       return state !== TweetState.Deleted;
//     })
//     .map(({ pubkey, account }) => {
//       const timestamp = account.data.subarray(0, 8).readInt32LE();
//       const state = account.data.subarray(8, 8 + 1).readInt8();
//       const prefix = account.data.subarray(9, 9 + 4).readInt8();
//       const tag = account.data.subarray(13, 13 + prefix).toString();
//       return new TagType(tag, 1, pubkey, timestamp);
//     });

//   type tagProps = {
//     [key: string]: TagType;
//   };

//   const tags = allTags.reduce((acc: tagProps, item: TagType) => {
//     if (item.tag !== "[deleted]") {
//       if (acc[item.tag]) {
//         acc[item.tag].count += 1;
//         if (item.timestamp > acc[item.tag].timestamp) {
//           acc[item.tag].timestamp = item.timestamp;
//           acc[item.tag].tweet = item.tweet;
//         }
//       } else {
//         acc[item.tag] = item;
//       }
//     }
//     return acc;
//   }, {});

//   return Object.values(tags);
// };

// export const fetchUsers = async ({
//   program,
//   connection,
// }: {
//   program: Program;
//   connection: Connection;
// }) => {
//   // Prepare the discriminator filter
//   const tweetClient = program.account.tweet;
//   const tweetAccountName = "Tweet";
//   const tweetDiscriminatorFilter = {
//     memcmp: tweetClient.coder.accounts.memcmp(tweetAccountName),
//   };

//   // Prefetch all tweets with their user + timestamp + state + tag only
//   const allTweets = await connection.getProgramAccounts(program.programId, {
//     filters: [tweetDiscriminatorFilter],
//     dataSlice: { offset: 8, length: 32 + 8 + 1 + 4 + 50 * 4 },
//   });

//   const tweetMap = allTweets
//     .filter(({ account }) => {
//       const state = account.data.subarray(40, 40 + 1).readInt8();
//       return state !== TweetState.Deleted;
//     })
//     .map(({ pubkey, account }) => {
//       const user = new PublicKey(account.data.subarray(0, 32));
//       const timestamp = account.data.subarray(32, 32 + 8).readInt32LE();
//       const prefix = account.data.subarray(41, 41 + 4).readInt8();
//       const tag = account.data.subarray(45, 45 + prefix).toString();
//       return new UserType(user, pubkey, tag, timestamp, 0);
//     });

//   type accType = {
//     [key: string]: UserType;
//   };

//   const aliasData = await fetchUsersAlias(program, connection);

//   const users = tweetMap.reduce((acc: accType, item: UserType) => {
//     if (item.last_tag !== "[deleted]") {
//       const userKey = item.user.toBase58();
//       if (acc[userKey]) {
//         acc[userKey].total_posts += 1;
//         if (item.last_timestamp > acc[userKey].last_timestamp) {
//           acc[userKey].tweet = item.tweet;
//           acc[userKey].last_timestamp = item.last_timestamp;
//           acc[userKey].last_tag = item.last_tag;
//         }
//       } else {
//         const [aliasPDA, _] = PublicKey.findProgramAddressSync(
//           [utils.bytes.utf8.encode("user-alias"), item.user.toBuffer()],
//           program.programId
//         );
//         acc[userKey] = new UserType(
//           item.user,
//           item.tweet,
//           item.last_tag,
//           item.last_timestamp,
//           1,
//           aliasData[aliasPDA.toBase58()]
//         );
//       }
//     }
//     return acc;
//   }, {});

//   const orderedUsers = Object.values(users).sort(
//     (a, b) => b.total_posts - a.total_posts
//   );
//   return orderedUsers;
// };

// export const userFilter = (userBase58PublicKey: string) => ({
//   memcmp: {
//     offset: 8, // discriminator,
//     bytes: userBase58PublicKey,
//   },
// });

// export const tagFilter = (tag: string) => ({
//   memcmp: {
//     offset:
//       8 + // Discriminator.
//       32 + // User public key.
//       8 + // Timestamp.
//       1 + // State
//       4, // Tag string prefix.
//     bytes: bs58.encode(Buffer.from(tag)),
//   },
// });

export const sendTweet = async (workspace: any, nftMintAddress: PublicKey, content: string) => {
  // let mintKeypair = new PublicKey("Fkq1LTTWrCJpXSvdeAJBDUPXNUcx8v9Tm4Po65nr4dbt")
  if (workspace) {
    const program = workspace.program;
    const nftConfigPda = await getNftConfigPda(nftMintAddress);
    const postNum = await (await program.account.nftConfigPda.fetch(nftConfigPda[0])).postsNum;
    const postPda = await getPostPda(nftMintAddress, postNum);
    const tokenAddress = await getAssociatedAddress(nftMintAddress, workspace.wallet.publicKey);
    try {
      await program.methods
        .createPost(content)
        .accounts({
          payer: workspace.wallet.publicKey,
          nftConfigPda: nftConfigPda[0],
          postPda: postPda[0],
          nftMint: nftMintAddress,
          nftToken: tokenAddress,
        })
        .rpc();
        
      const account = {user: nftMintAddress, timestamp: Date.now(), state: null, tag: "", content: content}
      const tweet = new Tweet(nftMintAddress, account)
      return {postPdaAddress:postPda[0], tweet: tweet, message: "Your tweet was sent successfully!", };
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
};
