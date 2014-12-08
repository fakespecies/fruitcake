//fruitcake.js by ZVK for http://fakespecies.com
//Audio
var audioCtx
	,bufferLoader
  ,fruitcake = {  sources: []
                  ,urls: ['./sounds/piano.mp3', './sounds/cherries.mp3', './sounds/cinnimon.mp3', './sounds/flour.mp3', './sounds/lemons.mp3', './sounds/nuts.mp3']
                  ,gainNodes: []
                };				
//INITIALIZE
function initAudio() {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
	audioCtx = new AudioContext();
	bufferLoader = new BufferLoader(audioCtx, fruitcake.urls, finishedLoading);
	bufferLoader.load();
}

function finishedLoading(bufferList){
	window.audioIsLoaded = true;
	for(var i = 0; i < bufferList.length; i++){
		fruitcake.sources[i] = audioCtx.createBufferSource();
    fruitcake.gainNodes[i] = audioCtx.createGain();
		fruitcake.sources[i].buffer = bufferList[i];
    fruitcake.sources[i].loop = true;
    fruitcake.sources[i].connect(fruitcake.gainNodes[i]);
		fruitcake.gainNodes[i].connect(audioCtx.destination);
	}
}

function playAllSounds() {
  //audioCtx.loop = true;
	for (var i = 0; i < fruitcake.sources.length; i++){
		fruitcake.sources[i].start(0);
    if(i === 0){
      fruitcake.gainNodes[i].gain.value = 1;
    } else {
      fruitcake.gainNodes[i].gain.value = 0;
    }
	}
}

function setVolume(gn, val){
	fruitcake.gainNodes[gn].gain.value = val;
}

//WEB API ABSTRACTION BufferLoader Class
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}