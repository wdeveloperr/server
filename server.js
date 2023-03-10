const app = require("express")();


const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");
const PORT = 3000;

const users = {};

const io = new Server(httpServer,{
  cors: {
    
    origin: "*",
    credentials: true,
    methods:["GET","POST"]
  }
});


app.get("/",(req,res) => {
    console.log("homepage - Hello world")
    res.status(200).json({name:"Md Wasik"})
})

io.on("connection", (socket) => {
  console.log("someone connected and socket id = " + socket.id)

  socket.on("disconnect",() => {
    console.log(`${socket.id} is diconnected`);

    for(let user in users){
      if(users[user] === socket.id){
        delete users[user];
      }
    }
    io.emit("all_user",users); 
    

  })

  socket.on("new_user",username => {
    console.log(username + " is online");
    users[username] = socket.id;

    io.emit("all_user",users);
  })

  socket.on("send_message",(data) => {
    
    const socketId = users[data.reciever];
    io.to(socketId).emit("new_message",data)

  })
});


httpServer.listen(PORT, () => {
    console.log("your server is ready on port = " + PORT)
});