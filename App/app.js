$(function(){
	var gui = require('nw.gui');
	win = gui.Window.get();
	var nativeMenuBar = new gui.Menu({ type: "menubar" });
	nativeMenuBar.createMacBuiltin("Simple Markdown");
	win.menu = nativeMenuBar;
	var fs = require("fs");
	var converter = new Showdown.converter();
	$("#src").on('change keyup paste',function(){
		var text = $(this).val();
		var html = converter.makeHtml(text);
		$("#dist").html(html);
	});
	$("#src").keydown(function(e){
		if (e.keyCode === 9) {
    		e.preventDefault();
    		var elem = e.target;
    		var val = elem.value;
    		var pos = elem.selectionStart;
   			elem.value = val.substr(0, pos) + '\t' + val.substr(pos, val.length);
    		elem.setSelectionRange(pos + 1, pos + 1);
		}
	});
	$("#mdExporter").change(function(e){
		var path = $(this).val();
		var dir = path.substring(0,path.lastIndexOf("/")+1);
		if(path && dir != "/Users/"){
			fs.writeFile(path,$("#src").val(),function(err){
				if(err){
					throw err;
				}
			});
		}
		$(this).val("");
	});
	$("#mdImporter").change(function(e){
		var file = $(this).prop("files")[0];
		var fr = new FileReader();
		fr.onload = function(){
			$("#src").val(fr.result);
			$("#src").trigger("change");
		}
		fr.readAsText(file); 
	});
	$(window).keydown(function(e){
		if(e.keyCode == 83 && e.metaKey){
			$("#mdExporter").click();
		}
		if(e.keyCode == 79 && e.metaKey){
			$("#mdImporter").click();
		}
	});
});