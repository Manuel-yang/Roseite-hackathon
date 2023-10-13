import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";
import { toCollapse } from "../utils";

export class UserType {
  user: PublicKey;
  user_display: string;
  tweet: PublicKey;
  last_tag: string;
  last_timestamp: number;
  total_posts: number;

  constructor(
    user: PublicKey,
    tweet: PublicKey,
    last_tag: string,
    last_timestamp: number,
    total_posts: number,
    user_display?: string,
  ) {
    this.user = user;
    this.user_display = user_display ? user_display : toCollapse(user);
    this.tweet = tweet;
    this.last_tag = last_tag;
    this.last_timestamp = last_timestamp;
    this.total_posts = total_posts;
  }

  get created_ago(): string {
    return dayjs.unix(this.last_timestamp).fromNow();
  }
}
