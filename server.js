const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utilis/messages');
const { userJoin,getCurrentUser,getRoomUsers,userLeave } = require('./utilis/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(__dirname,'public')));

io.on('connection', socket =>
{
  socket.on("joinRoom", ({username,room}) =>
  {
  const user = userJoin(socket.id,username,room);
  socket.join(user.room);
  socket.emit('message',formatMessage("admin","Welcome to IPL Fans chatbox"));
  socket.broadcast.to(user.room).emit('message',formatMessage("admin",` ${user.username} has joined the chat`));  // emit to everybody except the user

  io.to(user.room).emit('roomUsers',{
    room: user.room,
    users: getRoomUsers(user.room)
  });



  });



  socket.on('disconnect',()=>
  {
    const user = userLeave(socket.id);
    if(user)
    {
      io.to(user.room).emit('message',formatMessage("admin",`${user.username} has left the chat`));
    }
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users: getRoomUsers(user.room)
    });
    
  });


  socket.on("messageFromChat", msg =>
  {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username, msg));
  });

});


server.listen(3000, ()=>
  console.log('server running on port 3000')
    );