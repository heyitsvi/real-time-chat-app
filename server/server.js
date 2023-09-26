const express = require("express");
const app = express();
http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Data = require("./db/models/data");
const dbSaveMessage = require("./services/dbSaveMessage");
const dbGetMessages = require("./services/dbGetMessages");
const leaveRoom = require("./utils/leave-room");
require("dotenv").config();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Add cors middleware

const server = http.createServer(app);

//connect to database
const dbURI = process.env.MONGODB_URL;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to db");
    server.listen(4000, () => console.log("Server is running on port 4000"));
  })
  .catch((error) => console.log(error));

// Create an io server and allow for CORS from https://master--stirring-froyo-bd9c94.netlify.app/ with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: "https://stirring-froyo-bd9c94.netlify.app",
    methods: ["GET", "POST"],
  },
});

const CHAT_BOT = "ChatBot";
let chatRoom = "";
let allUsers = [];

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // Add a user to a room
  socket.on("join_room", (data) => {
    const { username, room } = data; // Data sent from client when join_room event emitted
    console.log(username, room);
    socket.join(room); // Join the user to a socket room

    let __createdtime__ = new Date().toLocaleString();
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });

    socket.emit("receive_message", {
      message: `Welcome ${username}!`,
      username: CHAT_BOT,
      __createdtime__,
    });

    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);

    socket.on("send_message", (data) => {
      const { message, username, room, __createdtime__ } = data;
      io.in(room).emit("receive_message", data); // Send to all users in room, including sender
      dbSaveMessage(message, username, room, __createdtime__) // Save message in db
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    });

    socket.on("leave_room", (data) => {
      const { username, room } = data;
      socket.leave(room);
      const __createdtime__ = new Date().toLocaleString();
      // Remove user from memory
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(room).emit("chatroom_users", allUsers);
      socket.to(room).emit("receive_message", {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        __createdtime__,
      });
      console.log(`${username} has left the chat`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from the chat");
      const user = allUsers.find((user) => user.id == socket.id);
      if (user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(chatRoom).emit("chatroom_users", allUsers);
        socket.to(chatRoom).emit("receive_message", {
          message: `${user.username} has disconnected from the chat.`,
        });
      }
    });

    dbGetMessages(room).then((msgs) => {
      socket.emit("last_10_messages", msgs);
    });
  });
});
