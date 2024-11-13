import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import "react-chat-elements/dist/main.css";
import { FaComments } from "react-icons/fa";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import { useFetchData } from "../../utils/hooks/useFetchData";

const ChatMessenger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(
    JSON.parse(sessionStorage.getItem("chatMessages")) || [
      {
        text: "Hi, I am your chatbot! Let me know if you have any questions about the app.",
        position: "left",
        date: new Date(),
      },
    ]
  );
  const [inputText, setInputText] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const { email } = useContext(UserLoginContext);
  const { data, loaded } = useFetchData(`/users?email=${email}`);
  const user =
    loaded && data.content && data.content.length > 0
      ? data.content[0]
      : { photoUrl: "/Images/user_icon.png" };

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const fetchSuggestedQuestions = async () => {
    if (isOpen) {
      try {
        const response = await axios.get("/qa/random");
        setSuggestedQuestions(response.data);
      } catch (error) {
        console.error("Error fetching random questions:", error);
      }
    }
  };

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Obține întrebările sugerate la montarea componentelor
    fetchSuggestedQuestions();
  }, []);

  const sendMessage = (messageText) => {
    const newMessage = {
      text: messageText,
      position: "right",
      date: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => botResponse(messageText), 1000);
  };

  const botResponse = async (userMessage) => {
    try {
      const response = await axios.post("/qa/similar", {
        query: userMessage,
      });

      const botMessage = response.data.answer || "Sorry, don't know the answer";
      const responseMessage = {
        text: botMessage,
        position: "left",
        date: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    } catch (error) {
      console.error("Error sending message to server:", error);

      const errorMessage = {
        text: "Oops! There was an error processing your request.",
        position: "left",
        date: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 h-auto">
      {!isOpen && (
        <button
          className="bg-blue-detail tw rounded-full p-3 shadow-lg transition focus:outline-none"
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

            {isTyping && (
              <div className="flex items-center space-x-2 justify-start">
                <img
                  src="/Images/bot_icon.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="max-w-xs p-2 rounded-lg bg-blue-detail tw rounded-tl-none text-white">
                  <p>Typing...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Secțiunea pliabilă cu întrebări sugerate și buton de refresh */}
          <div className="bg-gray-100 border-t">
            <button
              onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
              className="ps-2 font-semibold hover:underline focus:outline-none"
            >
              {isSuggestionsOpen ? "Hide Suggestions" : "Show Suggestions"}
            </button>

            {isSuggestionsOpen && (
              <div className="ps-2 flex items-center space-x-2 flex-wrap">
                {suggestedQuestions.slice(0, 2).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question.question)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 w-auto my-1"
                  >
                    {question.question}
                  </button>
                ))}
                <button
                  onClick={fetchSuggestedQuestions}
                  className="px-2 py-1 rounded bg-blue-detail text-white"
                >
                  <RefreshIcon />
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-100 border-t flex items-center space-x-2">
            <textarea
              rows="2"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText);
                }
              }}
              style={{ minHeight: "2.5rem" }}
              className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:bg-blue-detail focus:outline-none overflow-auto"
            />
            <button
              onClick={() => sendMessage(inputText)}
              className="bg-blue-detail tw px-4 py-2 rounded-md focus:outline-none transition"
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
