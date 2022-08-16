const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT =  process.env.PORT || 3000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://webdeneme.byethost33.com/"
    }
});

app.use(cors())
let users = []
app.get("/api", (req, res) => {
  res.status(200).json({user: users.length})
});
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)  
    socket.on("message", data => {
      socketIO.emit("messageResponse", data)
    })

    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))

    socket.on("newUser", data => {
      users.push(data)
      socket.in(theSocketId).socketsJoin("room1");
      socketIO.emit("newUserResponse", users)
    })
 
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter(user => user.socketID !== socket.id)
      socketIO.emit("newUserResponse", users)
      socket.disconnect()
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});