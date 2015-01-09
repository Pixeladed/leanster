$(document).ready(function() {
	var LeanCanvas;

	$("#create").click(function() {
		Lean.view.hideview("greetview");
		var temp = setTimeout(function() {
			Lean.view.showview("editorview");
		},250);

		LeanCanvas = new Lean.model.canvas('New canvas');
		window.canvas = LeanCanvas;
	});

	$('#upload').click(function() {
		$('#uploadInput')[0].click();
	});

	$('#uploadInput').change(function(e) {
		$("#create")[0].click();
		var reader = new FileReader();
		var file = e.target.files[0];
		reader.readAsText(file);
		reader.onloadend = function() {
			var content = JSON.parse(reader.result);
			LeanCanvas.content = content.content;
			LeanCanvas.name = content.name;
			LeanCanvas.render("all");
			$('h3.canvas-title').html(LeanCanvas.name);
		}
	});

	$('#export').click(function() {
		var blob = new Blob([LeanCanvas.export()], {type: "text/plain;charset=utf-8"});
		saveAs(blob, LeanCanvas.name+".lean");
	});

	$("div.view#editorview div.canvas div.row div.columns h6.columns-title span").click(function(e) {
		var name = $(e.target).parent()[0].innerHTML.toString().replace('<span></span>','');

		Lean.view.modal.show(name,"#modalInput");
		$('div.modal textarea').focus();
		//Item submit
		$('#itemSubmit').unbind('click').click(function() {
			name = $('div.modal h5').text();
			Lean.view.modal.hide();
			//Make new item
			console.log(name);
			var item = new Lean.model.item({
				branch: name,
				order: LeanCanvas.content[name].length,
				val: $('#itemContent').val(),
				color: $('li.itemColorOpt.selected span').text()
			});
			console.log(item);
			//Add item to canvas
			LeanCanvas.add(item);
		});
		//Color selection
		$('li.itemColorOpt').click(function(e) {
			$('li.itemColorOpt.selected').removeClass('selected');
			$(e.target).addClass('selected');
		});
	});

	$('#share').click(function() {
		Lean.view.modal.show("Share canvas","#modalShare");
	});

	$('ul.columns-content').on("click",".itemDelete",function(e) {
		var details = $(e.target).parent().attr('data-item').split(',');
		console.log(LeanCanvas.content[details[0]][details[1]]);
		LeanCanvas.delete(LeanCanvas.content[details[0]][details[1]]);
	});

	$('ul.columns-content').on("click",".itemEdit",function(e) {
		var details = $(e.target).parent().attr('data-item').split(',');
		Lean.view.modal.show("Edit item","#modalInput");
		var original = $(e.target).parent().text();
		$('div.modal textarea').val(original.substring(0,original.length - 5));
		$('div.modal textarea').focus();
		//Item submit
		$('#itemSubmit').unbind('click').click(function() {
			Lean.view.modal.hide();
			var newContent = $('div.modal textarea').val();
			var newColor = $('li.itemColorOpt.selected span').text();
			LeanCanvas.edit(details[0],details[1],newContent,newColor);
		});
		//Color selection
		$('li.itemColorOpt').click(function(e) {
			$('li.itemColorOpt.selected').removeClass('selected');
			$(e.target).addClass('selected');
		});
	});

	$('.canvas-title').click(function() {
		var newName = prompt("Name this canvas");
		LeanCanvas.changeName(newName);
		$('.canvas-title').text(newName);
	});
	
});