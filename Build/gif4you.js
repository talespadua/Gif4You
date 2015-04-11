var fs = require('fs');
var path = require('path');
var gui = require('nw.gui');


var win = gui.Window.get();

var uploadElement = document.getElementById('getFile');
var openFileButton = document.getElementById('openFile');
var slideshow = document.getElementById('slideshow');
var gifPreview = document.getElementById('gifPreview');
var writeButton = document.getElementById('generateGif');

var paths = [];
var gifImage;

var nwDir = path.dirname(process.execPath);

var settings = require(nwDir+'/config.json');

//var slideStatus = false;

var pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var openFileUpload = function(){
	uploadElement.click();
};

var openSlideshow = function(){
	var slide = gui.Window.open('slideshow.html', {
		toolbar: false,
		min_width: 640,
    	min_height: 460
	});
};

var decodeBase64Image = function(dataString){
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}

var writeSettings = function(){
	var data = JSON.stringify(settings, null, 4);

	fs.writeFile(nwDir+'/config.json', data, function(err){
		if (err) throw err
		console.log('Settings File updated');
	})
}

var writeGif = function(){
	console.log(gifImage);	

	var imageBuffer = decodeBase64Image(gifImage);

	var filename = settings.gifName + pad(settings.gifNumber, 4) + ".gif";

	fs.writeFile(nwDir+'\\gifs/' + filename, imageBuffer.data, function(err){
		if (err) throw err
		console.log('File saved as ' + filename);
		alert("Arquivo salvo como: " + filename);

		settings.gifNumber += 1;

		writeSettings();
	})
}

var selectGifs = function () {
	var images = uploadElement.files;
	if(images.length == 0){
		return;
	}
	
	deleteImg();

	for(var i = 0; i < images.length; i++){
		paths.push(images[i].path);
	}

	gifshot.createGIF({
		images: paths,
		gifWidth: 300,
		gifHeight: 500,
		interval:0.2
	} ,function(obj) {
		if(!obj.error) {
			var image = obj.image,
			animatedImage = document.createElement('img');
			gifImage = image;
			animatedImage.id = "gifID";
			animatedImage.src = image;
			gifPreview.appendChild(animatedImage);
		}
	});
};

var deleteImg = function(){
	paths = [];
	var imgtag = document.getElementById('gifID');
	if(imgtag != null){
		imgtag.parentNode.removeChild(imgtag);
	}
	console.log(imgtag);
}

if (window.addEventListener) {
	openFileButton.addEventListener('click', openFileUpload);
	uploadElement.addEventListener('change', selectGifs);
	slideshow.addEventListener('click', openSlideshow)
	writeButton.addEventListener('click', writeGif)
} else {
	openFileButton.attachEvent('onclick', openFileUpload);
	uploadElement.attachEvent('onchange', selectGifs);
	slideshow.attachEvent('onclick', openSlideshow);
	writeButton.attachEvent('onclick', writeGif);
}

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