import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";
import { toCollapse } from "../utils";

export enum CommentState {
  Edited,
  Deleted,
}

export class Comment {
  publicKey: PublicKey;
  user: PublicKey;
  tweet: PublicKey;
  parent?: PublicKey;
  timestamp: number;
  state: CommentState | undefined;
  content: string;
  user_display: string;

  constructor(publicKey: PublicKey, account: any, alias?: string) {
    this.publicKey = publicKey;
    this.user = account.user;
    this.tweet = account.tweet;
    this.parent = account.parent;
    this.timestamp = account.timestamp;
    this.state = account.state;
    this.content = account.content;
    this.user_display = alias || toCollapse(this.user);
  }

  get key(): string {
    return this.tweet.toBase58();
  }

  get created_at(): string {
    return dayjs.unix(this.timestamp).format("lll");
  }

  get created_ago(): string {
    return dayjs.unix(this.timestamp).fromNow();
  }
}
