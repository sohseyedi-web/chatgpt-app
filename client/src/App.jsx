import { useState, useEffect } from "react";
import * as RiIcon from "react-icons/ri";
import ChatInput from "./components/ChatInput";
import Messages from "./components/Messages";
import Logo from "./assets/chat.svg";
import User from "./assets/user.svg";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

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
    updatePosts("loading...", false, true);
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

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypeResponse(post);
    } else {
      setPosts((prevPost) => {
        return [...prevPost, { type: isLoading ? "loading" : "user", post }];
      });
    }
  };

  return (
    <main className="relative">
      <section className="md:w-[60%] w-[95%] mx-auto mt-20  layout ">
        {posts.length === 0 && (
          <div className="pt-5">
            <div className="h-8 w-8 mt-5 mx-auto text-white animate-bounce">
              <RiIcon.RiArrowUpCircleLine size={23} />
            </div>
            <p className="text-center text-white font-medium">
              برای شروع لطفا یک پیام بفرستید
            </p>
          </div>
        )}
        {posts.map((post, index) => (
          <>
            <div className="flex gap-4 items-center my-3" key={index}>
              <img
                src={
                  post.type === "bot" || post.type === "loading" ? Logo : User
                }
                alt="user"
                className="h-12 w-12 rounded-full flex-shrink-0"
              />
              {post.type === "loading" ? (
                <span className="animate-ping text-white">
                  <RiIcon.RiLoaderFill size={26} />
                </span>
              ) : (
                <div
                  className={`py-2 px-5 text-white w-fit rounded-2xl ${
                    post.type === "bot" ? "bg-[#2b2b36]" : "bg-[#2540fc]"
                  }  whitespace-pre-wrap`}
                >
                  {post.post}
                </div>
              )}
            </div>
          </>
        ))}

        <div
          className={" fixed top-5 md:w-[40%] w-[95%] md:right-[32%] right-2"}
        >
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
      <div className="md:fixed hidden md:top-1/3 top-0 md:left-0 md:flex md:flex-col bg-slate-100 rounded-r-lg md:p-1">
        <a
          href="https://github.com/sohseyedi-web"
          target={"_blank"}
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiGithubLine size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/sohseyedi"
          target={"_blank"}
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiLinkedinLine size={24} />
        </a>
        <a
          href="/"
          target={"_blank"}
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiTwitterLine size={24} />
        </a>
        <a
          href="https://mahak-charity.org/online-payment/"
          target={"_blank"}
          className="mb-3 transition-all hover:text-[#0f9e7b] hover:transition-all"
        >
          <RiIcon.RiHandHeartLine size={24} />
        </a>
      </div>
    </main>
  );
}

export default App;
