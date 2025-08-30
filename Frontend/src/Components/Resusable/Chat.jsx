import React from "react";
import bg1 from "../../assets/bg1.jpg";

const Chat = ({
  isUser = false,
  userName = "Name",
  data = "Hello!",
  profileImage = bg1,
}) => {
  return (
    <div
      className={`flex w-full gap-3 px-2 py-2 ${
        isUser ? "justify-end" : "justify-start"
      } animate-fadeIn`}
    >
      {/* Left Profile (Agent) */}
      {!isUser && (
        <div className="min-w-10 min-h-10">
          <img
            src={profileImage}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
          />
        </div>
      )}

      {/* Message Section */}
      <div
        className={`flex flex-col max-w-[80%] sm:max-w-[500px] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <span className="text-sm px-2 font-semibold text-blue-400 mb-1">
          {userName}
        </span>

        <div
          className={`px-4 py-2 rounded-2xl border text-sm sm:text-base whitespace-pre-wrap break-words
          ${isUser
            ? "bg-[#68a8e8] text-white border-blue-400 hover:shadow-md"
            : "bg-[#EBEDF2] text-gray-900 border-gray-300 hover:shadow-md"
          }`}
        >
          {data}
        </div>
      </div>

      {/* Right Profile (User) */}
      {isUser && (
        <div className="min-w-10 min-h-10">
          <img
            src={profileImage}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
