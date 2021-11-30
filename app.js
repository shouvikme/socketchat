const express = require('express');
const app = express();
const port = 3000;
const server = require("http").createServer(app);

const f = require("./functions");

const io = require("socket.io")(server);

var allowCrossDomain = function(req, res, next) {
  // Website you wish to allow to connect
res.setHeader('Access-Control-Allow-Origin', '*');

// Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// Request headers you wish to allow
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader('Access-Control-Allow-Credentials', true);
next();
}

app.use(allowCrossDomain);
app.use(express.json());
app.use(express.urlencoded());




/* Gateway */
app.get('/', (req, res) => { res.send('Socket Chat Says Hello') })

// API to create a namespace
app.post('/create-ns', (req, res) => { 
  
  var name_space = req.body.roomID;

  /* Does this name space exist */
  var arr = io._nsps.keys();
  var index = -1;
  for (var key of arr)
  {
    console.log("Key ;"+key);
    if (key == "/"+name_space) { console.log("Match Found");  index=1; }
  }

  if(index==-1)
  {
      var nsp = io.of('/'+req.body.roomID);

      /* Just a cute welcome message. Dont do aww */
      nsp.on('connection', function(socket)
      {
        
        let headers = socket.handshake.headers;

        /* a trigger when a client joins the chat */
        socket.on('join' , function(msg)
        { 
            socket['data'] = msg;
            socket.broadcast.emit('join' , msg+"has joined the chat");
        })
        

        /* Orchestrate chat message */
        socket.on('chat', function(msg){
          
          f.handleIncomingMsg(msg);
          //io.of("1234").broadcast.emit("chat message" , msg);
          socket.broadcast.emit("chat message" , msg);
        });

        socket.on('data-channel', function(msg){
          
          f.handleIncomingMsg(msg);
          //io.of("1234").broadcast.emit("chat message" , msg);
          socket.broadcast.emit("data" , msg);
        });
        

        socket.on('disconnect', function(msg){
          
          socket.broadcast.emit("join" , socket['data']+" disconnected");
        });



      });
      console.log("Namespace Generated");
  }
  else
  {
      console.log("Namespace already exists");
  }
 

  

  res.send({message:'NS OK'}); 

})



server.listen(port, () => {
  console.log(`Socket Chat Listening at http://localhost:${port}`)
})