import React, { useState } from "react";

const formatTime = (timeString) =>
  new Date(timeString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const CommentCard = ({ comment, level = 0, onReply }) => {
  const [showInput, setShowInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (onReply) onReply(replyText);
    setReplyText("");
    setShowInput(false);
  };

  return (
    <div
      className={`flex gap-4 mb-6 ${
        level > 0 ? "ml-6 md:ml-10 border-l-2 border-gray-200 pl-4" : ""
      }`}
    >
      <img
        src={comment.image}
        alt={comment.name}
        className="w-10 h-10 rounded-full border shadow-sm object-cover"
      />

      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="font-semibold text-gray-800">{comment.name}</span>
          <span className="text-gray-400 text-xs">{formatTime(comment.time)}</span>
        </div>

        <p className="text-gray-700 text-sm mt-1 leading-relaxed">
          {comment.content}
        </p>

        {level === 0 && (
          <button
            onClick={() => setShowInput(!showInput)}
            className="text-blue-500 hover:underline text-xs mt-1"
          >
            {showInput ? "Cancel" : "Reply"}
          </button>
        )}

        {showInput && (
          <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Post Reply
              </button>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply, idx) => (
              <CommentCard key={idx} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;