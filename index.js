var express = require('express');
var app = express();
var server = require('http').createServer(app); 
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;
users = [];
connections = [];



app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//Listen for incoming sockets
io.sockets.on('connection', function(socket){
   connections.push(socket);
   
   //Disconnect
   socket.on('disconnect', function(data) { 
    users.splice(users.indexOf(socket.username), 1); 
    updateUsernames(); 
   connections.splice(connections.indexOf(socket), 1);
   console.log("Disconnected");
   });

    //Send Message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });


    //New User
    socket.on('new user', function(data, callback){
        callback(true); 
        socket.username = data; 
        users.push(socket.username); 
        updateUsernames();
    });
    
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});
    
server.listen(port, function(){
  console.log('listening on *:' + port);
 });