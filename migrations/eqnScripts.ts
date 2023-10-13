import * as fs from 'fs';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  
} from '@solana/web3.js';

import {
  CreateCandyMachineInput,
  keypairIdentity,
  Metaplex,
  NftWithToken,
  sol,
  toBigNumber,
  AuctionHouse
} from '@metaplex-foundation/js';
import { create32BitsHash } from './hash';
import bs58 from 'bs58';

const devNet =
  'https://solana-devnet.g.alchemy.com/v2/moMW9KWONENiemPAjl96Lcns4NHU1jif';
const mainNew = 'https://api.mainnet-beta.solana.com';

const mainNet =
  'https://solana-mainnet.g.alchemy.com/v2/BN2dE3kFa5zPU895iUA_o8YjlpsaUyay';


const privateKey = ""
const decodedKey1 = bs58.decode(privateKey);
// console.log(decodedKey1)
const test = new Uint8Array()
const secretKey = Keypair.fromSecretKey(decodedKey1);

const connetionMainNet = new Connection(mainNew, 'finalized');

const connection2 = new Connection(devNet, 'processed');

const connectionLocalNet = "http://127.0.0.1:8899"

const mx = Metaplex.make(connection2).use(keypairIdentity(secretKey));

(async () => {

    const collectionNft = await createCollection();
    const { candyMachineId, collectionAddress } = await createCandyMachine(
      collectionNft,
    );
    console.log(
      `CandyMachine Information:${candyMachineId}, ${collectionAddress}`,
    );
    // const auctionHouse = await creatAH();
    // console.log(
    //   `CandyMachine Information:${candyMachineId}, ${collectionAddress},AH:${auctionHouse}`,
    // );

  })();

// CandyMachineData

async function getCandyMachineData(
  collectionAddress: PublicKey,
): Promise<CreateCandyMachineInput> {
  return {
    symbol: 'RSI',
    itemsAvailable: toBigNumber(2000000),
    authority: secretKey,
    sellerFeeBasisPoints: 500, 
    maxEditionSupply: toBigNumber(0),
    isMutable: true,
    creators: [{ address: secretKey.publicKey, share: 100 }],
    itemSettings: {
      type: 'hidden',
      hash: create32BitsHash('RSI'),
      name: 'RSI #$ID+1$',
      uri: 'https://shdw-drive.genesysgo.net/7vMHNrU6Q8yoijrNz4oDbqzCZtH7o8a3Nuq2fgj8K7Vk/$ID+1$.json',
    },
    collection: {
      address: collectionAddress,
      updateAuthority: secretKey,
    },
    groups: [
      {
        // only mint by seed platform
        label: 'RSI',
        guards: {
          addressGate: {
            address: new PublicKey(
              '5hQuukq75QtannUJsHxMTvBbmc2ivCayqQHzPD4fp9Ti', 
            ),
          },
        },
      },
    ],
  };
}


async function createCollection() {
  const { nft: collectNft } = await mx.nfts().create(
    {
      name: 'Roseite',
      symbol: 'RSI',
      uri: 'https://shdw-drive.genesysgo.net/7vMHNrU6Q8yoijrNz4oDbqzCZtH7o8a3Nuq2fgj8K7Vk/demoNft.png',
      sellerFeeBasisPoints: 500,
      isCollection: true,
      updateAuthority: secretKey,
    },
    {
      payer: secretKey,
      commitment: 'finalized',
    },
  );


  return collectNft;
}


async function createCandyMachine(collectionNft: NftWithToken) {
  const input = await getCandyMachineData(collectionNft.address);
  const { candyMachine } = await mx.candyMachines().create(input, {
    payer: secretKey,
    commitment: 'finalized',
  });
  console.log(`candyMachine: ${candyMachine.address.toBase58()}`);
  return {
    candyMachine: candyMachine,
    collection: collectionNft,
    collectionAddress: collectionNft.address.toBase58(),
    candyMachineId: candyMachine.address.toBase58(),
  };
}

async function creatAH(): Promise<AuctionHouse> {
  const auctionHouseSettings = {
    sellerFeeBasisPoints: 200, // 2%
    requiresSignOff: false, 
    canChangeSalePrice: true,
  };
    const ah = await mx.auctionHouse().create(auctionHouseSettings);
    return ah.auctionHouse;
}


