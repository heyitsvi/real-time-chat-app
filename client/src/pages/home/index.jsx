import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

function Home({ username, setUsername, room, setRoom, socket }) {
  const navigate = useNavigate();

  function joinRoom(e) {
    e.preventDefault();
    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });
    }
    navigate("/chat", { replace: true });
  }

  return (
    <div className={styles.container}>
      <div>
        <form className={styles.formContainer} onSubmit={joinRoom}>
          <h1>{`<>DevRooms</>`}</h1>
          <input
            className={styles.input}
            style={{ width: "100%" }}
            placeholder="Username..."
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <select
            className={styles.input}
            style={{ width: "100%" }}
            required
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          >
            <option>-- Select Room --</option>
            <option value="javascript">JavaScript</option>
            <option value="node">Node</option>
            <option value="express">Express</option>
            <option value="react">React</option>
          </select>
          <button
            className="btn btn-secondary"
            style={{ width: "100%" }}
            type="submit"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
