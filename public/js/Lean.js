$(document).ready(function() {

	var Lean = {
		model: {
			canvas: function(name) {
				this.name = name,
				this.content = {
					"Problems": [],
					"Solutions": [],
					"Key Metrics": [],
					"Unique Value Proposition": [],
					"Unfair Advantage": [],
					"Channels": [],
					"Customer Segments": [],
					"Cost Structure": [],
					"Revenue Streams": []
				},
				this.add = function(item) {
					if (item instanceof Lean.model.item) {
						this.content[item.branch].push(item);
						this.render(item.branch);
						this.change(item.branch);
						return true;
					} else {
						return false;
					}
				},
				this.delete = function(item) {
					this.content[item.branch].splice(item.order,1);
					console.log('deleting '+item.val);
					for (o=0;o<this.content[item.branch].length;o++) {
						this.content[item.branch][o].order = o;
					}
					this.render(item.branch);
					this.change(item.branch);
				 	return true;
				},
				this.render = function(branch) {
					if (branch === "all") {
						//RENDER ALL
						for (var name in this.content) {
							this.render(name);
						};
					} else {
						//RENDER SPECIFIC BRANCH
						$('#'+Lean.util.translate(branch)+' ul').html('');
						for (var i = 0; i < this.content[branch].length; i++) {
							console.log("rendering: "+'#'+Lean.util.translate(branch)+' ul');
							$('#'+Lean.util.translate(branch)+' ul').append(
								Lean.util.ui.getItemHtml(this,branch,i)
							);
						};
					};
				},
				this.edit = function(branch,order,content,color) {
					this.content[branch][order].val = content;
					this.content[branch][order].color = color;
					this.render(branch);
					this.change(branch);
					return true;
				},
				this.canvasChange = null,
				this.change = function(branch) {
					if (this.canvasChange) {
						this.canvasChange(branch);
						return true;
					} else {
						console.log("canvasChange function is not defined");
						return false;
					}
				},
				this.changeName = function(name) {
					this.name = name;
					this.change("name");
				},
				this.export = function() {
					return JSON.stringify({name:this.name,content:this.content});
				}
			},
			item: function(opt) {
				this.branch = opt.branch;
				this.order = opt.order;
				this.val = opt.val;
				this.color = opt.color;
			}
		},
		view: {
			hideview: function(viewname) {
				$("#"+viewname).css({
					width: "90%",
					height: "90vh",
					"margin-left": "5%",
					"margin-top": "5vh",
					"opacity": "0",
					"z-index": "-1"
				});
			},
			showview: function(viewname) {
				$("#"+viewname).css({
					width: "100%",
					height: "100vh",
					"margin-left": "0",
					"margin-top": "0",
					"opacity": "1",
					"z-index": "1" 
				});
			},
			modal: {
				show: function(title,id) {
					$('div.modal').html($(id).html());
					$('div.modal h5').text(title);
					$('.modal').css("display","block");
					$('#overlay').css("display","block");
					var temp = setTimeout(function() {
						$('.modal').css("top","0");
						$('#overlay').css("opacity","1");
					}, 250);
					$('#overlay').click(function() {
						Lean.view.modal.hide();
					});
				},
				hide: function() {
					$('.modal').css("top","-1000px");
					$('#overlay').css("opacity","0");
					var temp = setTimeout(function() {
						$('.modal').css("display","none");
						$('#overlay').css("display","none");
					}, 250);
				}
			}
		},
		util: {
			translate: function(branch) {
				var dict = {
					"Problems": "problem",
					"Solutions": "solution",
					"Key Metrics": "key",
					"Unique Value Proposition": "unique",
					"Unfair Advantage": "unfair",
					"Channels": "channel",
					"Customer Segments": "customer",
					"Cost Structure": "cost",
					"Revenue Streams": "revenue"
				}
				return dict[branch];
			},
			ui: {
				getItemHtml: function(canvas,branch,order) {
					return "<li class='itemColorOpt "+canvas.content[branch][order].color+"' data-item='"+branch+","+order+"'>"+canvas.content[branch][order].val+"<span class='itemDelete'>x</span><span class='itemEdit'>edit</span></li>"
				}
			},
			exportarray: function(canvas){
				data = [];
				if (canvas instanceof Lean.model.canvas) {
					for (branch in canvas.content) {
						for (i=0;i<canvas.content[branch].length;i++) {
							current = canvas.content[branch][i];
							data.push([current.branch,current.order,current.val,(current.color)?current.color:"black"]);
						}
					}
				};	
				return data;
			},
			exportcsv: function(data) {
				var csvContent = "data:text/csv;charset=utf-8,";
				data.forEach(function(infoArray, index){
				    dataString = infoArray.join(",");
					csvContent += dataString + "\n";
				}); 
				return csvContent;
			},
		}	
	}

	window.Lean = Lean;

});

