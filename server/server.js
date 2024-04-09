const express = require("express");
const { createServer } = require("http");
const cors = require("cors");

const app = express();
app.use(cors());
const server = createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  users[socket.id] = {};
  socket.emit("id", socket.id);
  socket.on("disconnect", () => {
    if (users && users[socket.id]) {
      delete users[socket.id];
      io.emit("removeClient", socket.id);
    }
  });

  socket.on("update", (message) => {
    if (users[socket.id]) {
      users[socket.id].t = message.t;
      users[socket.id].p = message.p;
      users[socket.id].r = message.r;
      users[socket.id].action = message.action;
      users[socket.id].name = message.name;
      users[socket.id].scale = message.scale;
      users[socket.id].color = message.color;
    }
  });

  setInterval(() => {
    io.emit("users", users);
  }, 50);
});
server.listen(3472, () => {
  console.log("Server is running on https://localhost:3472");
});
