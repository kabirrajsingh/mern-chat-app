const express=require('express');
const app=express();
require('dotenv').config();
const port=process.env.PORT || 8080;
const routeHandler=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes');
const connectDB=require('./config/db');
connectDB();
//resolving routes
// /api/v1 - login and register

app.use(express.json());
app.use('/api/user',routeHandler);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
const server=app.listen(port,console.log(`App is running on port ${port}`));
var pingTimeout=60000
const io=require('socket.io')(server,{
    cors:{
        origin:"http://127.0.0.1:3000",pingTimeout
    }
})

io.on("connection",(socket)=>{
    console.log(`Connected to socket.io`);
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData.name)
        socket.emit("connected") 
    });
    
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log(`User joined room ${room}`);
    })
    
// notificaiton
// group Chat
// admin function
// remove from group
// realtime
    socket.on("new message",(newMessageRecieved)=>{
        
        var chat=newMessageRecieved.chat;
        console.log(`Message recieved ${chat.users[0].name}`)  
        if(!chat.users) return console.log(`Chat.users not defined`) 
 
        chat.users.forEach(user=>{
            if(user._id==newMessageRecieved.sender_id) return;
            socket.in(user._id).emit("message recieved",newMessageRecieved)
        })
    })

    socket.on('typing',(room)=>{
        socket.in(room).emit("typing");
    });
    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing");
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})

