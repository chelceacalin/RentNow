import React, { useContext, useEffect, useState } from "react";
import "react-chat-elements/dist/main.css";
import { FaComments } from "react-icons/fa";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import { useFetchData } from "../../utils/hooks/useFetchData";

const ChatMessenger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(
    JSON.parse(sessionStorage.getItem("chatMessages")) || []
  );
  const [inputText, setInputText] = useState("");
  const { email } = useContext(UserLoginContext);

  const { data, loaded } = useFetchData(`/users?email=${email}`);
  const user = loaded ? data.content[0] : { photoUrl: "/Images/user_icon.png" };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        text: inputText,
        position: "right",
        date: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");

      setTimeout(() => botResponse(inputText), 1000);
    }
  };

  const botResponse = (userMessage) => {
    let botMessage = "I’m here to help!";

    if (userMessage.toLowerCase().includes("hello")) {
      botMessage = "Hello! How can I assist you today?";
    } else if (userMessage.toLowerCase().includes("book")) {
      botMessage = "Looking for a book? I can help with recommendations!";
    }

    const responseMessage = {
      text: botMessage,
      position: "left",
      date: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, responseMessage]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          className="bg-blue-detail tw rounded-full p-3 shadow-lg  transition focus:outline-none"
          onClick={toggleChat}
        >
          <FaComments size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-[30rem] bg-white rounded-lg shadow-xl flex flex-col mt-4">
          <div className="bg-blue-detail text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <h4 className="text-lg font-semibold">Chat Assistant</h4>
            <button
              onClick={toggleChat}
              className="text-white text-lg font-semibold focus:outline-none hover:text-gray-200"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 ${
                  msg.position === "left" ? "justify-start" : "justify-end"
                }`}
              >
                <img
                  src={
                    msg.position === "left"
                      ? "/Images/bot_icon.png"
                      : user.photoUrl
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div
                  className={`max-w-xs p-2 rounded-lg text-white ${
                    msg.position === "left"
                      ? "bg-blue-detail tw rounded-tl-none"
                      : "bg-green-detail"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-100 border-t flex items-center space-x-2">
            <textarea
              rows="1"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:bg-blue-detail focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-detail tw px-4 py-2 rounded-md focus:outline-none  transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessenger;
