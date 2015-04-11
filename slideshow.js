var fs = require('fs');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();

var gifs = [];
var gifPlace = document.getElementById('gifdiv');
var n = 0;

var nwDir = path.dirname(process.execPath);

fs.readdir(nwDir+'\\gifs', getFileNames);

console.log("Path is" + path);
console.log("Dir is " + nwDir+'\\gifs');

function getFileNames(err, files) {
  if (err) {
    throw err;
  }
  gifs = [];
  console.log("file is " + files);
  files.forEach(forEachFile);
}

function forEachFile(file) {
	fs.lstat('/'+file, function(err, stats){
    if (path.extname(file) == ".gif") {
			gifs.push(file);
	  }
	});
}

function doTheThings(){
	fs.readdir(nwDir+'\\gifs', getFileNames);
	changeGif();
}

function changeGif(){
	// gifPlace.setAttribute("background-image", );
	var url = "url("+process.execPath+")";
  console.log("On display, dir is "+ url);  
  var gifConteiner = document.getElementById("gif");
	//document.body.style.backgroundImage = url;
  gifConteiner.style.backgroundImage = "url(C:/Users/tales.cpadua/Documents/Gif4You/gifs/"+gifs[n]+")"
	if (n >= gifs.length -1) {
		n = 0;
	} else {
		n++;
	}
}

setInterval(doTheThings, 1000 * 4);

document.body.onkeyup = function(e){
    if(e.keyCode == 27){
        win.close();
    }
    if(e.keyCode == 122){
    	var isfull = win.isFullscreen;
    	if (isfull){
    		win.leaveFullscreen();
    	}
    	else{
    		win.enterFullscreen();
    	}
    }
}