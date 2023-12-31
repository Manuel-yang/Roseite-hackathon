// import { Program, utils, web3 } from "@project-serum/anchor";
// import { AnchorWallet } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";
import { Comment } from "../../models/Comment";
// import { sleep, toCollapse } from "../../utils";
// import { AliasProps, getUserAlias } from "./alias";

import { PublicKey } from "@metaplex-foundation/js";
import { getAssociatedAddress, getNftConfigPda, getPostPda, getPostCommentPda } from "../../utils/pdas";
import { BN } from "@project-serum/anchor";
import { UserTweet } from "../../models";

// export const sendComment = async (
//   { program, wallet }: { program: Program; wallet: AnchorWallet },
//   tweet: PublicKey,
//   content: string
// ) => {
//   const comment = web3.Keypair.generate();

//   try {
//     await program.methods
//       .sendComment(tweet, content, null)
//       .accounts({
//         comment: comment.publicKey,
//         user: wallet.publicKey,
//         systemProgram: web3.SystemProgram.programId,
//       })
//       .signers([comment])
//       .rpc();

//     sleep(2000);
//     const commentAccount = await program.account.comment.fetch(
//       comment.publicKey
//     );
//     const alias = await getUserAlias(program, commentAccount.user as PublicKey);
//     return {
//       comment: new Comment(comment.publicKey, commentAccount, alias),
//       message: "Your comment was sent successfully!",
//     };
//   } catch (err) {
//     console.error(err);
//     return {
//       comment: null,
//       // @ts-ignore
//       message: err.toString(),
//     };
//   }
// };

// export const updateComment = async (
//   { program, wallet }: { program: Program; wallet: AnchorWallet },
//   commentKey: PublicKey,
//   content: string
// ) => {
//   try {
//     await program.methods
//       .updateComment(content)
//       .accounts({
//         comment: commentKey,
//         user: wallet.publicKey,
//       })
//       .rpc();

//     return {
//       success: true,
//       message: "Your comment was updated successfully!",
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

// export const deleteComment = async (
//   { program, wallet }: { program: Program; wallet: AnchorWallet },
//   commentKey: PublicKey
// ) => {
//   try {
//     await program.methods
//       .deleteComment()
//       .accounts({
//         comment: commentKey,
//         user: wallet.publicKey,
//       })
//       .rpc();

//     return { success: true, message: "Your comment was deleted successfully!" };
//   } catch (err) {
//     console.error(err);
//     return {
//       success: false,
//       // @ts-ignore
//       message: err.toString(),
//     };
//   }
// };

// export const fetchComments = async (
//   program: Program,
//   filters: any[],
//   aliasObj: AliasProps
// ) => {
//   const comments = await program.account.comment.all(filters);
//   const allComments = comments
//     .map((comment) => {
//       const user = comment.account.user as PublicKey;
//       const [aliasPDA, _] = PublicKey.findProgramAddressSync(
//         [utils.bytes.utf8.encode("user-alias"), user.toBuffer()],
//         program.programId
//       );

//       const alias = aliasObj[aliasPDA.toBase58()]
//         ? aliasObj[aliasPDA.toBase58()]
//         : toCollapse(user);

//       return new Comment(comment.publicKey, comment.account, alias);
//     })
//     .filter((a) => a.state !== CommentState.Deleted)
//     .sort((a, b) => b.timestamp - a.timestamp);

//   return allComments;
// };

// export const commentTweetFilter = (tweetKey: string) => ({
//   memcmp: {
//     offset: 8 + 32, // discriminator(8) + user(32),
//     bytes: tweetKey,
//   },
// });


export const sendComment = async (workspace: any, content: string, tweet: UserTweet) => {
  try {
    const program = workspace.program
    const reviewNum = await (await program.account.postPda.fetch(tweet.postPdaAddress)).reviewNum
    const postCommentPda = await getPostCommentPda(tweet.postPdaAddress, reviewNum)
    const tokenAddress = await getAssociatedAddress(tweet.nftAddress, workspace.wallet.publicKey)
 
    await program.methods.createPostReview(content)
      .accounts({
        payer: workspace.wallet.publicKey,
        postPda: tweet.postPdaAddress,
        reviewPda: postCommentPda[0],
        nftMint: tweet.nftAddress,
        nftToken: tokenAddress
      })
      .rpc()
      // const res = await (await program.account.reviewPda.fetch(postCommentPda[0]))
    return {
      content: content,
      commentPdaAddress: postCommentPda[0],
      message: "Your comment was sent successfully!",
    };
    }catch(error: any) {
      console.log(error)
    }
}
