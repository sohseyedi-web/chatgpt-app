import { useState } from "react";
import * as RiIcon from "react-icons/ri";
import ChatInput from "./components/ChatInput";
import Messages from "./components/Messages";
import Logo from "./assets/chat.svg";
import User from "./assets/user.svg";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");

  const fetchBotMessage = async () => {
    const { data } = await axios.post(
      "http://localhost:4000",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input || input.trim() === "") return;
    updatePosts(input);
    updatePosts("input" , false);
    setInput("");
    fetchBotMessage().then((res) => {
      updatePosts(res.bot.trim(), true);
    });
  };

  const autoTypeResponse = (text) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevPost) => {
          let lastItem = prevPost.pop();
          if (lastItem.type !== "bot") {
            prevPost.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prevPost.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevPost];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const updatePosts = (post, isBot) => {
    if (isBot) {
      autoTypeResponse(post);
    } else {
      setPosts((prevPost) => {
        return [...prevPost, { type: "user", post }];
      });
    }
  };

  return (
    <main className="relative">
      <section className="w-[60%] mx-auto mt-5">
        {posts.length === 0 && (
          <div className="pt-5">
            <p className="text-center text-white font-medium">
              برای شروع لطفا یک پیام بفرستید
            </p>
            <div className="h-8 w-8 mt-5 mx-auto text-white animate-bounce">
              <RiIcon.RiArrowDownCircleLine size={23} />
            </div>
          </div>
        )}
        {posts.map((post, index) => (
          <>
            <div className="flex gap-4 items-center" key={index}>
              <img
                src={post.type === "bot" ? Logo : User}
                alt="user"
                className="h-12 w-12 rounded-full flex-shrink-0"
              />
              <div
                className={`py-2 px-5 text-white w-fit rounded-2xl ${
                  post.type === "bot" ? "bg-[#2b2b36]" : "bg-[#2540fc]"
                }  whitespace-pre-wrap`}
              >
                {post.post}
              </div>
            </div>
          </>
        ))}

        <div className={" fixed bottom-5 w-[40%] right-[32%]"}>
          <form className={" bg-white rounded-lg"}>
            <input
              type="text"
              placeholder={"..."}
              className="w-full rounded-lg p-1 text-xl  border-none outline-none  font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-[#2540fc] absolute content-none  text-white w-28 right-1 rounded-lg top-[18%] h-2/3 flex items-center justify-center"
            >
              <RiIcon.RiSendPlaneLine size={23} />
            </button>
          </form>
        </div>
      </section>
      <div className="fixed top-1/3 left-0 flex flex-col bg-slate-100 rounded-r-lg md:p-1">
        <a
          href="/"
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiGithubLine size={24} />
        </a>
        <a
          href="/"
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiLinkedinLine size={24} />
        </a>
        <a
          href="/"
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiTwitterLine size={24} />
        </a>
        <a
          href="/"
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiHandHeartLine size={24} />
        </a>
      </div>
    </main>
  );
}

export default App;
