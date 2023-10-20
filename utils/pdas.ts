import { PublicKey } from "@metaplex-foundation/js";
import * as anchor from "@project-serum/anchor";
import { TOKEN_METADATA_PROGRAM_ID, CANDY_MACHINE_PROGRAM_ID, PROGRAM_ID, COLLECTION_ID, AUTHORITY_ADDRESS } from "./CONSTANTS"
import * as token from "@solana/spl-token";
import { Connection } from '@solana/web3.js';
import { programs } from '@metaplex/js';
import { BN } from "bn.js";
const { Metadata, MetadataData } = programs.metadata;

export const getMetadataPDA = async (
  mintKey: PublicKey,
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKey.toBuffer(),

    ],
    TOKEN_METADATA_PROGRAM_ID
  ));
    return data;
}

export const getMasterEditionPDA = async (
  mintKey: PublicKey,
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKey.toBuffer(),
      Buffer.from("edition")
    ],
    TOKEN_METADATA_PROGRAM_ID
  ))
  return data
}

// export const getMetadataDelegateRecord = async (
//   mintKey: PublicKey,
// ) => { 
//   const data = (await anchor.web3.PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("metadata"),
//       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//       mintKey.toBuffer(),
//     ],
//     TOKEN_METADATA_PROGRAM_ID,
//   ))
// }

export const getAuthorityPda = async (
  mintKey: PublicKey,
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("candy_machine"),
      new PublicKey(mintKey).toBuffer(),
    ],
    CANDY_MACHINE_PROGRAM_ID
  ))
  return data
}

export const getAssociatedAddress = async (
  mint: PublicKey,
  owner: PublicKey
) => {
  const tokenAddress = await anchor.utils.token.associatedAddress({
    mint: mint,
    owner: owner
  })
  return tokenAddress
}

export const getCandyMachineAuthorityPda = async (
  candyMachine: PublicKey
 ) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("candy_machine"),
      new PublicKey(candyMachine).toBuffer(),
    ],
    CANDY_MACHINE_PROGRAM_ID
  ))
  return data
}

export const getMetadataDelegateRecord = async () => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata")
    ],
    TOKEN_METADATA_PROGRAM_ID
  ))
}

export const getCounterPda = async (
  candy_machine: PublicKey,
  user: PublicKey
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("counter_account"),
      candy_machine.toBuffer(),
      user.toBuffer(),
    ],
    candy_machine
  ))
  return data
}

export const getNftConfigPda = async (
  mint_address: PublicKey
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("nft_config_pda"),
      mint_address.toBuffer(),
    ],
    PROGRAM_ID
  ))
  return data
}

export const getPostPda = async (
  mint_address: PublicKey,
  num
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

export const getPostReviewPda = async (
  post_address: PublicKey,
  num
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("review_pda"),
      post_address.toBuffer(),
      new BN(num).toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  ))
  return data
}



export const getCompoundCounterPda = async (
  candy_machine: PublicKey,
  user: PublicKey
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("compound_counter_account"),
      candy_machine.toBuffer(),
      user.toBuffer(),
    ],
    candy_machine
  ))
  return data
}

export const getStakeDetailsPda = async (
  creator: PublicKey
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("stake_details"),
      COLLECTION_ID.toBuffer(),
      creator.toBuffer()
    ],
    PROGRAM_ID
  ))
  return data
}

export const getNftAuthority = async (
  stakeDetails: PublicKey
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("nft_authority_pda"),
      stakeDetails.toBuffer()
    ],
    PROGRAM_ID
  ))
  return data
}

export const getStakeDetails = async () => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("stake"),
      COLLECTION_ID.toBuffer(),
      PROGRAM_ID.toBuffer()
    ],
    PROGRAM_ID
  ))
  return data;
}

export const getNftRecord = async (
  stakeDetails: PublicKey,
  nftMint: PublicKey
) => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("nft_record"),
      stakeDetails.toBuffer(),
      nftMint.toBuffer()
    ],
    PROGRAM_ID
  ))
  return data
}

export const getCustodyATA = async (
  nftMint: PublicKey,
  nftAuthority: PublicKey
) => {
  const tokenAddress = await getAssociatedAddress(
    nftMint,
    nftAuthority,
  )
  return tokenAddress
}

// getMetadataPDA(new PublicKey("9B3nBYkjaytahxkFpkVgeRRPhNbrh94HJpz9iYFB7jur"))

export const getMarketPDA = async (owner: PublicKey): Promise<PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('MARKET'), owner.toBuffer()],
      PROGRAM_ID
    )
  )[0];
};

export const getEscrowPDA = async (
  marketPDA: PublicKey,
): Promise<PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('MARKET'),
        marketPDA.toBuffer(),
        Buffer.from('ESCROW'),
      ],
      PROGRAM_ID 
    )
  )[0];
};

export const getNftVaultPDA = async (
  nftMint: PublicKey,
): Promise<PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('MARKET'), Buffer.from('vault'), nftMint.toBuffer()],
      PROGRAM_ID
    )
  )[0];
};

export const getSellOrderPDA = async (
  sellerTokenAccount: PublicKey,
  price: anchor.BN,
): Promise<PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('MARKET'),
        sellerTokenAccount.toBuffer(),
        Buffer.from(price.toString()),
      ],
      PROGRAM_ID
    )
  )[0];
};

export const getBidPDA = async (
  marketPDAPDA: PublicKey,
  buyer: PublicKey,
  mint: PublicKey,
): Promise<PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('MARKET'),
        marketPDAPDA.toBuffer(),
        buyer.toBuffer(),
        mint.toBuffer(),
        Buffer.from('ESCROW'),
      ],
      PROGRAM_ID
    )
  )[0];
};

export const getCollectionDelegateRecordPda = async (candyMachineAuthorityPda: PublicKey) : Promise<PublicKey> => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      COLLECTION_ID.toBuffer(),
      Buffer.from("collection_authority"),
      candyMachineAuthorityPda.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  ))
  return data[0]
}

export const getProgramAdminPda = async () : Promise<PublicKey> => {
  const data = (await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("program_admin_pda"),
      PROGRAM_ID.toBuffer(),
      // AUTHORITY_ADDRESS.toBuffer()
    ],
    PROGRAM_ID
  ))
  return data[0]
}
