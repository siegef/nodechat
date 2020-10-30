const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')
app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require("mongoose");

var port = 3000;
var dbUri = "mongodb://localhost:27017";

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



var Message = mongoose.model("Message", { name: String, message: String });

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'))
})

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body)
    res.sendStatus(200);
  })
})

io.on('connection', () => {
  console.log("A user is connected");
})

mongoose.connect(dbUri, (err) => {
  console.log("MongoDB connected", err);
});

var server = http.listen(port, () => {
  console.log("Server is running on port", server.address().port);
});

