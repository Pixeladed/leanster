$(document).ready(function() {	

	var root = "http://leanster.herokuapp.com";
	var socket = io.connect(root);
	var UUID,room,CANVAS;

	var Collab = {
		start: function() {
			CANVAS = canvas;
			console.log("Collaborating on: "+CANVAS.name);
			CANVAS.canvasChange = function(branch) {
				if (branch == "name") {
					console.log("changed!");
					Collab.emit({
						"branch": branch,
						content: canvas.name
					});
				} else {
					console.log("changed!");
					Collab.emit({
						"branch": branch,
						content: CANVAS.content[branch]
					});
				}
			}
		},
		emit: function(item) {
			socket.emit(UUID+"/CLIENT_UPDATE",item);
			return true;
		},
		recieve: function(data) {
			if (data.branch == "name") {
				console.log("DATA RECIEVE: ");
				console.log(data);
				$('.canvas-title').text(data.content);
			} else if (data.branch == "all") {
				console.log("DATA RECIEVE: ");
				console.log(data);
				canvas.content = data.content.content;
				canvas.name = data.content.name;
				$('.canvas-title').text(data.content.name);
				canvas.render('all');
			} else {
				console.log("DATA RECIEVE: ");
				console.log(data);
				CANVAS.content[data.branch] = data.content;
				CANVAS.render(data.branch);
			}
		}
	}

	$('#create').click(function() {
		Collab.start();
		$('.shareURL span.replace').text(document.URL);
		$('.shareURL').attr('href',document.URL);
	});

	//Emit created info
	if (document.URL.length > root.length) {
		UUID = document.URL.split('/')[3];
		socket.emit("CLIENT_INIT",{created:true,uuid: UUID});
		console.log('Connected to server. UUID: '+UUID);

		// $('#create').trigger("click");
		$('#create')[0].click();
		console.log("emit client request");
		socket.emit(UUID+"/CLIENT_REQUEST",{uuid: UUID});
	} else {
		socket.emit("CLIENT_INIT",{created:false});
	}

	//Push uuid
	socket.on('SERVER_INIT', function(data) {
		console.log('Connected to server. UUID: '+data.uuid);
		UUID = data.uuid;
		$('.uuid').text(UUID);

		//Push state
		history.pushState({code:UUID},document.title,"/"+UUID);

		socket.on(UUID + "/SERVER_UPDATE",function(data) {
			Collab.recieve(data);
		});

		socket.on(UUID + "/SERVER_REQUEST",function(data) {
			Collab.emit({branch: "all",content:canvas});
		});

		//Confirm everything is setup
		socket.emit(UUID+"/CLIENT_UPDATE","ALL DONE!!!");
	});

	socket.on(UUID + "/SERVER_UPDATE",function(data) {
		console.log("recieved data");
		Collab.recieve(data);
	});

	//Confirm everything is setup
	socket.emit(UUID+"/CLIENT_UPDATE","EVERYTHING IS UP!!!");

	window.Collab = Collab;

});