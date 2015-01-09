//INIT
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
console.log('[debug] finished init');

//STATIC
app.use(express.static(__dirname + '/public'));

//LISTEN
server.listen(process.env.PORT);
console.log('[debug] listening on port '+process.env.PORT);

//ROUTE
app.get('/:id', function(req,res,next) {
	id = req.params.id;
	res.sendFile(__dirname + '/public/index.html');
});

//COLAB
function uuid(len) {
	var size = (len) ? len : 5;
	var identifier = "";
	var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < size; i++) {
		identifier += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return identifier;
}

io.on('connection', function(socket) {
	//Wait for client to init and see if they're joining or creating
	socket.on('CLIENT_INIT',function(data) {
		if (!data.created) {
			var generated = uuid(5);
			socket.emit('SERVER_INIT', {uuid: generated});

			socket.on(generated + "/CLIENT_UPDATE",function(data) {
				console.log("emit: "+generated + "/SERVER_UPDATE");
				socket.broadcast.emit(generated + "/SERVER_UPDATE",data);
			});

		} else {
			var temp = data.uuid;
			socket.on(data.uuid + "/CLIENT_UPDATE",function(data) {
				console.log("emit: "+temp + "/SERVER_UPDATE");
				socket.broadcast.emit(temp+ "/SERVER_UPDATE",data);
			});
			socket.on(data.uuid+"/CLIENT_REQUEST",function(data) {
				console.log("emit: "+temp+"/SERVER_REQUEST");
				socket.broadcast.emit(temp+"/SERVER_REQUEST");
			});
		}
	});

});

