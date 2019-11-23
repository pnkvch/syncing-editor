const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

let value = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "A line of text in a paragraph."
          }
        ]
      }
    ]
  }
};

const groupData = {};

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

io.on("connection", socket => {
  socket.on("new-operation", data => {
    groupData[data.groupId] = data.value;
    io.emit(`new-remote-operation-${data.groupId}`, data);
  });
});

app.get("/groups/:id", (req, res) => {
  const { id } = req.params;
  if (!(id in groupData)) {
    groupData[id] = value;
  }

  res.send(groupData[id]);
});

http.listen(4000, () => {
  console.log("listening on *:4000");
});
