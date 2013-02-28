//N3D s načítáním částí kódů
var N3D = {
  Math:{},
  Graphics:{},
  Game:{},
  Utils:{},
  Geometry:{},
  librariesAvailable:{
    "Math.Main":"maths.js",
    "Math.Matrix4":"matrix4.js",
    "Math.Vector2":"vector2.js",
    "Math.Vector3":"vector3.js",
    "Math.Vector4":"vector4.js",
    "Graphics.Camera":"camera.js",
    "Graphics.Scene":"scene.js",
    "Graphics.Texture":"texture.js",
    "Graphics.Render":"render.js",
    "Geometry.Object3D":"objects.js",
    "Game.Main":"game.js",
    "Utils":"tools.js",
    "Utils.Ajax":"ajax.js"
  }
};

N3D.Path = (function(){
  var scripts= document.getElementsByTagName('script');
  return scripts[scripts.length-1].src.split('?')[0].split('/').slice(0, -1).join('/')+'/';      // remove any ?query
})();

N3D.require = function(){
  var src = Array.prototype.slice.call(arguments);
  var length = src.length;
  var callbacks = {
    error:function(f){ this.error = f || this.error; },
    complete:function(f){ this.complete = f || this.complete; }
  };
  
  function loadJS(src){
    var head = document.getElementsByTagName('head')[0];
    var length = src.length;
    var js = document.createElement('script');
    var callbacks = {
      complete:function(f){ this.complete = f || this.complete; return this;},
      error:function(f){ this.error = f || this.error; return this;}
    }; 

    js.type = 'text/javascript';
    js.src = N3D.Path+src;

    head.appendChild(js); 
    
    js.onload = function(){
      callbacks.complete();
    };
    js.onerror = function(){
      callbacks.error();
    };   
  
    return callbacks;
  };
  
  for(var i=0;i<length;i++){
    if(name = N3D.librariesAvailable[ src[i] ]){
      loadJS(name);
    }
  }
  
  return callbacks;
};