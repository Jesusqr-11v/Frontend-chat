import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Connection with the backend
const socket = io("https://backend-chat-production.up.railway.app/");

export const App = () => {
  // useState username
  const [userName, setUsername] = useState("");
  // useState connected True - False
  const [isConnected, setIsConnected] = useState(false);
  // useState new message in writing
  const [newMessage, setNewMessage] = useState("");
  // useState messages
  const [messages, setMessages] = useState([]);

  const scrollRef = useRef(null);

  const userNameDebugged = userName === "" ? "User" : userName;

  useEffect(() => {
    // Receive data
    socket.on("connect", () => setIsConnected(true));
    socket.on("chatMessage", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("chatMessage");
    };
  }, []);

  // auto-scroll
  useEffect(()=>{
    const scrollHeight = scrollRef.current.scrollHeight;
    scrollRef.current.scrollTop = scrollHeight;
  },[messages])

  // event onSubmit
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chatMessage", {
      user: userNameDebugged,
      message: newMessage,
      id: socket.id,
    });
    setNewMessage("");
  };

  const stateColor = isConnected ? "green" : "red";

  return (
    <main className="container">
      <div className="card__chat">
        <div className="user__info">
          <section className="user__name">
            <div className={stateColor}>{}</div>
            <img src="/user.png" alt="user icon" className="user__icon" />
            <input
              type="text"
              className="user__text__name"
              placeholder="Ingrese nombre"
              onChange={(e) => setUsername(e.target.value)}
            />
          </section>
        </div>

        <div className="users__messages">
          <section className="section__message" ref={scrollRef}>
            {messages.map((message, i) => {
              const messageClass =
                message.id === socket.id
                  ? "message__sent"
                  : "message__received";
              return (
                <p className={messageClass} key={i}>
                  {message.id !== socket.id ? (
                    <strong>{message.user}: </strong>
                  ) : null}
                  {message.message}
                </p>
              );
            })}
          </section>
          <form className="user__form" onSubmit={sendMessage}>
            <input
              type="text"
              className="user__message"
              required
              placeholder="Escribe tu mensaje aqui"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            />
            <button className="user__button">
              <img src="/send-icon.jpg" alt="send icon" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
