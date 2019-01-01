var express = require("express");
var mongodb = require("mongodb");

var app = express();
var mongoClient = mongodb.MongoClient;
var server = app.listen(8080,"0.0.0.0");
var io = require("socket.io").listen(server);

app.get("/", function(require, response){
	
	response.sendFile(__dirname+"/index.html");

});

io.sockets.on("connection", function(socket){

	socket.on("send_to_server", function(data){

		mongoClient.connect("mongodb://127.0.0.1:27017/messenger", function(error, db){

			var chatCollection = db.collection("message");
			chatCollection.insert({"text":data["message"], "name":data["username"], "created_at":data["FullTime"]}, function(error,result){
				if(error) throw error;
			});

		});
		io.emit("send_to_client", data);
	});

});