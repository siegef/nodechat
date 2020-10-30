const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app = express();
var port = 3000;
var dbUri = "mongodb://localhost:27017";

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(dbUri, (err) => {
  console.log("MongoDB connected", err);
});
var Message = mongoose.model("Message", { name: String, message: String });

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
    res.sendStatus(200);
  })
})

var server = app.listen(port, () => {
  console.log("Server is running on port", server.address().port);
});
