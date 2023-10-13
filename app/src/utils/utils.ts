import * as anchor from "@project-serum/anchor";
import { NftSocialMedia } from "../../../target/types/nft_social_media"
import  ProgramIDL  from "../../../target/idl/nft_social_media.json"
import { BN, Program } from '@project-serum/anchor';
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./CONSTANTS";
// 创建一个provider所在链的program实例
export function createProgram(
    provider: anchor.AnchorProvider,
  ) : anchor.Program<NftSocialMedia> {
    const idl = JSON.parse(JSON.stringify(ProgramIDL))
    const programId = ProgramIDL.metadata.address;
    const program = new Program(
      idl,
      programId,
      provider
    ) as Program<NftSocialMedia>
    return program
  }

  export const getPostPda = async (
    mint_address: PublicKey,
    num: number
  ) => {
    const data = (await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("post_pda"),
        mint_address.toBuffer(),
        new BN(num).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    ))
    return data
  }