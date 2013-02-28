if(typeof N3D == "undefined"){
  var N3D = {};
}

N3D.Render = function(){};
N3D.Render.prototype = {
  setViewport:function(w,h){
    this.canvas.width = w;
    this.canvas.height = h;
    N3D.Game.viewport.width = w;
    N3D.Game.viewport.height = h;
    N3D.Game.viewport.aspect = w/h;
  },
  appendTo:function(el){
    el.appendChild(this.canvas);
  },
  setFullsize:function(){
    this.resize(window.innerWidth,window.innerHeight);
  },
  autoResize:function(callback){
    var that = this;
    window.onresize = function(){
      that.setFullsize();
      if(typeof callback === "funciton"){
        callback();
      }
    }
  }
};

N3D.Render2D = function(){
  this.init();
};
N3D.Render2D.prototype = N3D.Render.prototype;
N3D.Render2D.prototype.toString = function(){
  return "N3D.Render2D";
}
N3D.Render2D.prototype.clear = function(){
  this.context.clearRect(0,0,N3D.Game.viewport.width,N3D.Game.viewport.height);
};
N3D.Render2D.prototype.init = function(){
  var ctx;
  var canvas = document.createElement("canvas");

  try{
    ctx = canvas.getContext("2d");
  }catch(e){}
  
  if(!ctx){
    console.log("Your browser not supported 2D and pseudo 3D");
    return;
  }

  N3D.Game.viewport.type = "2d";

  this.canvas = canvas;
  this.context = ctx;
};
N3D.Render2D.prototype.resize = function(w,h){
  this.setViewport(w,h);
};
