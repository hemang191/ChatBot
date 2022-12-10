const path = require('path') ; 
const http = require ('http') ; 
const dotenv = require('dotenv') ;  
const express = require('express') ; 
const socketio = require('socket.io') ; 
const formatMessage = require('./utils/messages') ;  
dotenv.config({path: './config/config.env'}) ;
const {userJoin , getCurrentUser , userLeave , getRoomUsers } = require('./utils/users') ; 


const app = express() ; 
const server = http.createServer(app) ; 
const io = socketio(server) ; 

// set static folder 
app.use(express.static(path.join(__dirname, 'public'))) ; 

// run when the client  connect i.e object create of  io class ..
const botName = "chatbot" ; 
io.on('connection' , (socket)=>
{
    socket.on('joinRoom' , ({username , room})=>
    {
         // here socket.emit only display this message on the screen of the user 
        const user = userJoin(socket.id , username , room );
       // console.log(socket.id) ; 
        socket.join(user.room);


        socket.emit('message' , formatMessage(botName , 'Welcome to the chat room'));

    // broadcast when user connect (to other except user) 

        socket.broadcast.to(user.room)
        .emit('message' , formatMessage(botName , `${user.username} joined chat!`)); 
    //send users and room info

        io.to(user.room).emit('roomUsers' , {
        room : user.room , 
        users: getRoomUsers(user.room)  
   });
   });

  
    // listen for chat message 

    socket.on('chatMessage', msg=>
    {
      const user = getCurrentUser(socket.id) ;
      //console.log(user) ;  
      // console.log(msg); // here it is printing at our server and sending to client where socket.on is invoked  
        io.to(user.room).emit('message' , formatMessage(user.username , msg))  ; 
    })

    // run when client got disconnected 
    socket.on('disconnect' , ()=>
    {
       
        const user = userLeave(socket.id) ;
        console.log(user) ; 
        if(user)
        {
            io.to(user.room)
            .emit('message' , formatMessage(botName, `${user.username} has left chat`))  ;
        

         // send users and room info
        io.to(user.room)
        .emit("roomUsers" ,{
            room : user.room , 
            users: getRoomUsers(user.room) 
        })
       }
          
    })
})
const PORT = 3000 || process.env.PORT ;

server.listen(PORT , ()=> console.log(`Server running on the port ${PORT}`));  
