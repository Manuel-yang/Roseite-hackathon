import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";
export class TagType {
  tag: string;
  tweet: PublicKey;
  count: number;
  timestamp: number;

  constructor(tag: string, count: number, tweet: PublicKey, timestamp: number) {
    this.tag = tag;
    this.count = count;
    this.tweet = tweet;
    this.timestamp = timestamp
  }

  get tweetKey(): string {
    return this.tweet.toBase58();
  }

  get created_ago(): string {
    return dayjs.unix(this.timestamp).fromNow();
  }
}
