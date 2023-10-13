import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";
import { toCollapse } from "../utils";
import { Comment } from "./Comment";
import BN from "bn.js";

export type TweetAccount = {
  readonly user: PublicKey;
  readonly timestamp: number;
  readonly tag: string;
  readonly content: string;
  readonly state: TweetState | undefined;
};

export enum TweetState {
  Edited,
  Deleted,
}

export class UserTweet {
  nftAddress: PublicKey;
  content: string;
  reviewNum: BN;
  likeNum: BN;
  timeStamp: BN;
  constructor(nftAddress: PublicKey, content: string, reviewNum: BN, likeNum: BN, timeStamp: BN) {
    this.nftAddress = nftAddress;
    this.content = content;
    this.reviewNum = reviewNum;
    this.likeNum = likeNum;
    this.timeStamp = timeStamp;
  }
}

export class Tweet {
  publickey: PublicKey;
  user: PublicKey;
  timestamp: number;
  state: TweetState | undefined;
  tag: string;
  content: string;
  user_display: string;
  comments: Comment[] = [];

  constructor(publickey: PublicKey, account: any, alias?: string) {
    this.publickey = publickey;
    this.user = account.user;
    this.timestamp = account.timestamp;
    this.state = account.state;
    this.tag = account.tag;
    this.content = account.content;
    this.user_display = alias || toCollapse(this.user);
  }

  get key(): string {
    return this.publickey.toBase58();
  }

  get created_at(): string {
    return dayjs.unix(this.timestamp).format("lll");
  }

  get created_ago(): string {
    return dayjs.unix(this.timestamp).fromNow();
  }

  set setComments(comments: Comment[]) {
    this.comments = comments;
  }
}
