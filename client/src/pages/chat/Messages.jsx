import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("time " + data.createdAt);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    // Last 10 messages sent in the chat room (fetched from the db in backend)
    socket.on("last_10_messages", (last10Messages) => {
      // console.log("Last 10 messages:", last10Messages);
      setMessagesReceived((state) => [...last10Messages, ...state]);
    });

    return () => socket.off("last_10_messages");
  }, [socket]);

  // Scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>{msg.__createdtime__}</span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
