import Link from "next/link";
import { Comment } from "../models/Comment";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Avatar } from "flowbite-react";

export default function CommentCard({ comment }: { comment: Comment }) {
  const wallet = useAnchorWallet();
  const userRoute =
    wallet && wallet.publicKey.toBase58() === comment.user.toBase58()
      ? "/profile"
      : `/users/${comment.user.toBase58()}`;

  return (
    <div className="mt-4 pt-4 border-t border-skin-primary">
      <div className="flex items-center gap-2">
        <div className="mr-2">
          <Link href={userRoute}>
            <a>
              <Avatar
                img={`https://avatars.dicebear.com/api/jdenticon/${comment.user.toBase58()}.svg`}
                size="sm"
                rounded={true}
              />
            </a>
          </Link>
        </div>
        <h3
          className="inline font-semibold text-color-primary"
          title={comment.user_display}
        >
          <Link href={userRoute}>
            <a className="hover:underline">{comment.user_display}</a>
          </Link>
        </h3>
        <span className="text-color-secondary">•</span>
        <time
          className="text-sm text-color-secondary"
          title={comment.created_at}
        >
          <Link href={`/tweets/${comment.key}`}>
            <a className="hover:underline">{comment.created_ago}</a>
          </Link>
        </time>
      </div>
      <p className="whitespace-pre-wrap ml-10 text-color-secondary">
        {comment.content}
      </p>
    </div>
  );
}
