N3D.Audio = function(src){
  var audio = document.createElement('audio');
  var source = document.createElement('source');
      source.type = "audio/mpeg";
      source.src = src;  
  var embed = document.createElement('embed');
      embed.src = src;
  
  audio.appendChild(source);
  audio.appendChild(embed);
  this.context = audio;
  
  this.createFilter();
  
  this.setVolume(100);
};
N3D.Audio.prototype = {
  createFilter:function(){
    var lowshelf = this.context.createBiquadFilter(),
    mid = this.context.createBiquadFilter(),
    highshelf = this.context.createBiquadFilter();
    
    lowshelf.type = 3;
    mid.type = 5;
    highshelf.type = 4;
    
    this.context.connect(lowshelf);
    lowshelf.connect(mid);
    mid.connect(highshelf);
    //highshelf.connect(yourOutput);
  },
  play:function(){
    this.context.play();
  },
  stop:function(){
    this.context.pause();
    this.context.currentTime = 0; 
  },
  pause:function(){
    this.context.pause();
  },
  setVolume:function(v){
    var v = v/100;
    this.volume = v;
    this.context.volume = v;
  },
  volumeStep:function(v){
    var vol = this.volume;
    var volume = vol+v/100;
    
    if(0<volume && volume<1){
      this.volume = volume;
      this.context.volume = volume;
    }
  }
};

$Audio = N3D.Audio;
