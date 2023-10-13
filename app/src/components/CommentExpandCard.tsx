import React from "react";
import useTheme from "../hooks/useTheme";
import useNftScanner from "../hooks/useNftScanner";

interface CommentExpandCardProps {
  comments: string[];
}

const CommentExpandCard: React.FC<CommentExpandCardProps> = ({ comments }) => {
  const { theme } = useTheme();
  const { nftsList, selectedNftId } = useNftScanner();

  return (
    <div>
      {/* 白线风格 */}
      {comments.length > 0 && (
        <>
          <div className="h-0.5 bg-gray-500 my-4"></div>
        </>
      )}

      {/* 每个评论占一行 */}
      {comments.map((comment, index) => (
        <React.Fragment key={index}>
          {/* 评论内容 */}
          <div className="flex items-start my-4">
            {selectedNftId !== undefined && (
              <img className="w-10 h-11 rounded-full mr-4" src={nftsList[selectedNftId]?.data.metadata.image} />
            )}
            <div>
              {selectedNftId !== undefined && (
                <p className={`ml-2 text-sm ${theme === "dark" ? "text-gray-500" : ""}`}>
                  {nftsList[selectedNftId]?.data.name}
                </p>
              )}
              <p className={`ml-2 ${theme === "dark" ? "text-white" : ""}`}>{comment}</p>
            </div>
          </div>
          <div className="h-0.5 bg-gray-500 my-2"></div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default CommentExpandCard;
