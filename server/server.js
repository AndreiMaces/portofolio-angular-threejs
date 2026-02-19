const express = require("express");
const path = require("path");
const { createServer } = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

// Servire statică pentru frontend Angular (build)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// SPA fallback: rute necunoscute → index.html (nu și /socket.io pentru WebSocket)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/socket.io")) return next();
  res.sendFile(path.join(publicPath, "index.html"));
});

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

const PORT = process.env.PORT || 3472;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
