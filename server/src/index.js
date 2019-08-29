const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  socket.on("new-operation", data => {
    io.emit("new-remote-operation", data);
  });
});

http.listen(4000, () => {
  console.log("listening on *:4000");
});
