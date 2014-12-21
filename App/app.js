$(function(){
	var gui = require('nw.gui');
	win = gui.Window.get();
	var nativeMenuBar = new gui.Menu({ type: "menubar" });
	nativeMenuBar.createMacBuiltin("Simple Markdown");
	win.menu = nativeMenuBar;
	var fs = require("fs");
	var converter = new Showdown.converter();
	var data = "";
	$("#src").on('change keyup paste',function(){
		var text = $(this).val();
		var html = converter.makeHtml(text);
		$("#dist").html(html);
		if(data != $(this).val() && $("#mdExporter").data("selected")){
			$("title").text($("#mdExporter").attr("nwsaveas")+"*");
		}
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
		var filename = path.replace(/^.*[\\\/]/, '');
		if(path && dir != "/Users/"){
			fs.writeFileSync(path,$("#src").val());
			$(this).attr("nwsaveas",filename);
			$(this).attr("nwworkingdir",dir);
			$(this).data("selected",true);
			$("title").text(filename);
		}
	});
	$("#mdImporter").change(function(e){
		var file = $(this).prop("files")[0];
		var path = $(this).val();
		var dir = path.substring(0,path.lastIndexOf("/")+1);
		var filename = path.replace(/^.*[\\\/]/, '');
		var fr = new FileReader();
		var $exporter = $("#mdExporter");
		if(path){
			$exporter.attr("nwsaveas",filename);
			$exporter.attr("nwworkingdir",dir);
			$("title").text(filename);
			fr.onload = function(){
				$("#src").val(fr.result);
				$("#src").trigger("change");
				$exporter.data("selected",true);
			}
			fr.readAsText(file); 
		}
	});
	$(window).keydown(function(e){
		if(e.keyCode == 83 && e.metaKey){
			var $exporter = $("#mdExporter");
			if($exporter.data("selected") && !e.shiftKey){
				var nwsaveas = $exporter.attr("nwsaveas");
				var nwworkingdir = $exporter.attr("nwworkingdir");
				fs.writeFileSync(nwworkingdir+nwsaveas,$("#src").val());
				data = $("#src").val();
				$("title").text(nwsaveas);
			}else{
				$exporter.click();
			}
		}
		if(e.keyCode == 79 && e.metaKey){
			$("#mdImporter").click();
		}
		if(e.keyCode == 78 && e.metaKey){
			window.open("./index.html");
		}
	});
	gui.Window.get().on('close', function() {
        var r = confirm("編集しているファイルは保存されていません。このままウィンドウを閉じますか？");
        if (r) {
            this.close(true);
        } 
    });
});