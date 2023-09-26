import styles from "./styles.module.css";
import Messages from "./Messages";
import SendMessage from "./SendMessage";
import Room from "./Room";

const Chat = ({ username, room, socket }) => {
  return (
    <div className={styles.chatContainer}>
      <Room socket={socket} username={username} room={room} />
      <div>
        <Messages socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
