import React, { useEffect, useRef, useState } from "react";
import useTheme from "../hooks/useTheme";
import { FaTimes } from "react-icons/fa";
import useNftScanner from "../hooks/useNftScanner";
import { toLongCollapse } from "../utils";
import { UserTweet } from "../models";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from 'react-icons/ai';
import useComments from "../hooks/useComments";
import { PublicKey } from "@solana/web3.js";
import { getPostCommentPda } from "../utils/pdas";
import { BN, workspace } from "@project-serum/anchor";
import useWorkspace from "../hooks/useWorkspace";

interface ModalProps {
  isOpen: boolean;
  tweet: UserTweet;
  comments: any;
  setComments: (comment: any) => void;
  onClose: () => void;
}

export type commentPdaAccount = {
  nftMintAddress: PublicKey,
  postPdaAddress: PublicKey,
  reviewId: BN,
  content: string;
  likeNum: BN;
  reviewPostPdaAddress: PublicKey;
  reviewNum: BN;
  timeStamp: BN;
  status: number;
};

const CommentModal: React.FC<ModalProps> = ({ tweet, isOpen, comments, setComments, onClose }) => {
  const { nftsList, selectedNftId } = useNftScanner();
  const { sendComment } = useComments()
  const { theme } = useTheme();
  const workspace = useWorkspace()

  const [comment, setComment] = useState("");
  const [ isCommenting, setIsCommenting ] = useState(false)
  const [commentPdaAddressList, setCommentPdaAddressList] = useState<PublicKey[]>([]);
  const [rawCommentPdaAccountList, setRawCommentPdaAccountList] = useState<commentPdaAccount[]>([]);
  const [commentPdaAccountList, setCommentPdaAccountList] = useState<commentPdaAccount[]>([]);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const pElement = divRef.current.querySelector("p");
      if (pElement) {
        const pHeight = pElement.getBoundingClientRect().height;
        divRef.current.style.height = `${pHeight + 5}px`;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const cardContent = document.querySelector(".card-content");
    if (isOpen && cardContent) {
      cardContent.style.setProperty("z-index", "auto");
    } else {
      cardContent.style.setProperty("z-index", "1");
    }
  }, [isOpen]);

  // get all review pda hook
  useEffect(() => {
    const fetchCommentsPdaAddressList = async () => {
      const commentsNum = tweet.reviewNum.toNumber()
      if(workspace) {
        if(commentsNum != commentPdaAddressList.length) {
          for (let i = 0; i < commentsNum; i++) {
            let res = await getPostCommentPda(tweet.postPdaAddress, i)
            setCommentPdaAddressList((prev) => [...prev, res[0]])
            let commentPdaAccount = await workspace.program.account.reviewPda.fetch(res[0]) as unknown as commentPdaAccount
            commentPdaAccount.reviewPostPdaAddress = res[0]
            commentPdaAccount.postPdaAddress = tweet.postPdaAddress
            setRawCommentPdaAccountList((prev) => [...prev, commentPdaAccount]);
          }
        }       
      }
    }
    fetchCommentsPdaAddressList()
  },[isOpen])

    // // list all the post which status is post by time
    useEffect(() => {
      if (workspace && rawCommentPdaAccountList) {
        let sortByTimestamp = rawCommentPdaAccountList.sort((x, y) => {
          return x.timeStamp.toNumber() - y.timeStamp.toNumber();
        });
        sortByTimestamp = sortByTimestamp.filter((commentPdaAccount) => {
          return commentPdaAccount.status == 0
        })
        setCommentPdaAccountList(sortByTimestamp.reverse());
      }
    }, [rawCommentPdaAccountList]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCommenting(true)
    let result = await sendComment(comment, tweet)
    if (result && workspace) {
      const newCommentPdaAccount = await (await workspace.program.account.reviewPda.fetch(result.commentPdaAddress!)) as unknown as commentPdaAccount
      newCommentPdaAccount.reviewPostPdaAddress = result.commentPdaAddress!
      newCommentPdaAccount.postPdaAddress = tweet.postPdaAddress
      setCommentPdaAddressList((prev) => [...prev, result.commentPdaAddress!])
      setRawCommentPdaAccountList((prev) => [...prev, newCommentPdaAccount])
      setComment("")
      setIsCommenting(false)
    }
    // onClose();
  };

  if (!isOpen) {
    return null;
  }
  console.log(commentPdaAccountList)

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`bg-white w-5/12 p-6 rounded-xl shadow ${theme === "dark" ? "bg-black" : "border"}`}>
        <button onClick={onClose}>
          <FaTimes color={`${theme === "dark" ? "white" : "black"}`} />
        </button>

        <div className="flex items-center mb-4 mt-4">
          {selectedNftId !== undefined ? (
            <img className="w-10 h-11 rounded-full mr-4" src={nftsList[selectedNftId]?.data.metadata.image} />
          ) : (
            <img className="w-10 rounded-full" src={`https://avatars.dicebear.com/api/jdenticon/undefined.svg`} />
          )}
          {selectedNftId !== undefined && (
            <>
              <span className="font-medium text-gray-500 mr-4">{`${nftsList[selectedNftId]?.data.name}`} </span>
              <span className="text-gray-500 mr-3">{`@${toLongCollapse(tweet.nftAddress)}`}</span>
            </>
          )}
        </div>
        <div className="flex" ref={divRef}>
          <div className="bg-[#14F195] w-0.5 ml-4"></div>
          <p className={`text-md mb-4 ml-10 ${theme === "dark" ? "text-white" : ""}`}>{tweet.content}</p>
        </div>
        {/* comment block */}
        {commentPdaAccountList !== undefined ? (
          commentPdaAccountList.map((commentPdaAccount) => {
            return(
              <>
                <div className="flex items-center mb-4 mt-4">
                  {selectedNftId !== undefined ? (
                    <img className="w-10 h-11 rounded-full mr-4" src={nftsList[selectedNftId]?.data.metadata.image} />
                  ) : (
                    <img className="w-10 rounded-full" src={`https://avatars.dicebear.com/api/jdenticon/undefined.svg`} />
                  )}
                  {selectedNftId !== undefined && (
                    <>
                      <span className="font-medium text-gray-500 mr-4">{`${nftsList[selectedNftId]?.data.name}`} </span>
                      <span className="text-gray-500 mr-3">{`@${toLongCollapse(commentPdaAccount.nftMintAddress)}`}</span>
                    </>
                  )}
                </div>
                <div className="flex" ref={divRef}>
                  <div className="bg-[#14F195] w-0.5 ml-4"></div>
                  <p className={`text-md mb-4 ml-10 ${theme === "dark" ? "text-white" : ""}`}>{commentPdaAccount.content}</p>
                </div>
              </>
            )
          })
        )
        : null}
        <form onSubmit={handleSubmit}>
          <div className="flex mt-5">
 
            <textarea
              className="w-full h-32 p-2 rounded my-4 text-white bg-[#181823]"
              placeholder="Post Your Reply"
              value={comment}
              onChange={handleCommentChange}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="submit"
                disabled={isCommenting}
                isProcessing={isCommenting}
                processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
                size="md"
              >
                {isCommenting ? (<p>Processing</p>) : (<p>Comment</p>)}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
