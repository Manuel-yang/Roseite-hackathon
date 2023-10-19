import React, { useState } from "react";
import { UserTweet } from "../models";
import { FaRegComment, FaHeart, FaRetweet, FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import useTheme from "../hooks/useTheme";
import useNftScanner from "../hooks/useNftScanner";
import CopyToClipboardButton from "./CopyButton";
import { bnToData, toLongCollapse } from "../utils";
import CommentModal from "./CommentModal";
import CommentExpandCard from "./CommentExpandCard";
import UserTweetMenubar from "./UserTweetMenubar";

export default function UserTweetCard({ tweet }: { tweet: UserTweet }) {
  // console.log(tweet.postPdaAddress.toBase58())
  const { theme } = useTheme();
  const { nftsList, selectedNftId } = useNftScanner();

  const [retweets, setRetweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);

  const [retweetColor, setRetweetColor] = useState("");
  const [commentColor, setCommentColor] = useState("");
  const [likesColor, setLikesColor] = useState("");

  const [commentOpen, setCommentOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const changeCommentColor = () => {
    if (commentColor === "yellow") {
      setCommentColor("");
    } else {
      setCommentColor("yellow");
    }
  };

  const handleCommentOpen = () => {
    setCommentOpen(!commentOpen);
  };

  const handleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`card py-4 px-16 ${theme === "dark" ? "dark" : ""}`}>
      <div className="card-content">
        {/* Card Header */}
        <div className="grid grid-cols-1 gap-4">
          <div className="col-start-1 col-end-1">
            <div className="flex items-center mb-4 mt-3">
              {selectedNftId !== undefined ? (
                <img className="w-10 h-11 rounded-full mr-4" src={nftsList[selectedNftId]?.data.metadata.image} />
              ) : (
                <img className="w-10 rounded-full" src={`https://avatars.dicebear.com/api/jdenticon/undefined.svg`} />
              )}
              {selectedNftId !== undefined && (
                <>
                  <span className="font-medium text-gray-500 mr-4 ">{`${nftsList[selectedNftId]?.data.name}`} </span>
                  <span className="text-gray-500 mr-3"> {`@${toLongCollapse(tweet.nftAddress)}`}</span>
                </>
              )}
              <CopyToClipboardButton textToCopy={tweet.nftAddress.toString()} />
            </div>
          </div>
          
          <div className="col-start-2 col-end-2 flex items-center mb-4 mt-3">
            <UserTweetMenubar nftMintAddress={tweet.nftAddress} postPdaAddress={tweet.postPdaAddress} postId={tweet.postId}/>
          </div>
        </div>

        {/* Card Content */}
        <p className={`text-lg mb-4 ${theme === "dark" ? "text-white" : ""}`}>{tweet.content}</p>
        <p className="text-gray-500 mb-1">{bnToData(tweet.timeStamp)}</p>

        {/* Card Footer */}
        <div className="flex space-x-8 items-center mb-2">
          <div className="flex items-center">
            <FaRetweet className="text-gray-500 mr-1" color={retweetColor} />
            <span className="text-gray-500 mr-1">{retweets} </span>
            <span
              className="text-gray-500 cursor-pointer hover:underline"
              onClick={() => {
                if (retweets === 1) {
                  setRetweets(0);
                  setRetweetColor("");
                } else {
                  setRetweets(1);
                  setRetweetColor("#9945ff");
                }
              }}
            >
              Retweet
            </span>
          </div>
          <div className="flex items-center">
            <FaHeart className="text-gray-500 mr-1" color={likesColor} />
            <span className="text-gray-500 mr-1">{likes} </span>
            <span
              className="text-gray-500 cursor-pointer hover:underline"
              onClick={() => {
                if (likes === 1) {
                  setLikes(0);
                  setLikesColor("");
                } else {
                  setLikes(1);
                  setLikesColor("red");
                }
              }}
            >
              Likes
            </span>
          </div>
          <div className="flex items-center">
            <CommentModal
              tweet={tweet}
              isOpen={commentOpen}
              comments={comments}
              setComments={setComments}
              onClose={handleCommentOpen}
            />
            <FaRegComment className="text-gray-500 mr-1" color={commentColor} />
            <span className="text-gray-500 mr-1">{comments.length} </span>
            <span
              className="text-gray-500 cursor-pointer hover:underline"
              onMouseEnter={changeCommentColor}
              onMouseLeave={changeCommentColor}
              onClick={handleCommentOpen}
            >
              Comments
            </span>
            <button>
              {isExpanded ? (
                <FaAngleDoubleUp
                  className="ml-1 mt-1"
                  color={`${theme === "dark" ? "gray" : "black"}`}
                  onClick={handleIsExpanded}
                />
              ) : (
                <FaAngleDoubleDown
                  className="ml-1 mt-1"
                  color={`${theme === "dark" ? "gray" : "black"}`}
                  onClick={handleIsExpanded}
                />
              )}
            </button>
          </div>
        </div>

        {isExpanded ? <CommentExpandCard comments={comments} /> : null}
      </div>
    </div>
  );
}
