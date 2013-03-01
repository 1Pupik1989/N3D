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
    "Graphic.Camera":"camera.js",
    "Graphic.Scene":"scene.js",
    "Graphic.Texture":"texture.js",
    "Graphic.Render":"render.js",
    "Geometry.Object3D":"objects.js",
    "Game.Main":"game.js",
    "Utils":"tools.js",
    "Utils.Ajax":"ajax.js"
  }
};

N3D.Path = (function(){
  var scripts= document.getElementsByTagName('script');
  var path = scripts[scripts.length-1].src.match(/.*\//)[0];
  
  return path; 
})();



N3D.require = function(){
  var urls = Array.prototype.slice.call(arguments);
  var length = urls.length;
  var name;
  var loaded = 0;
  var errorNames = [];
  var head = document.getElementsByTagName("head")[0];

  var callbacks = {
    error:function(f){ this.error = f || this.error; return this; },
    complete:function(f){ this.complete = f || this.complete; return this; },
    success:function(f){ this.success = f || this.success; return this; }
  };

  
  var i=0;
  while(i<length){
    var src = N3D.librariesAvailable[ urls[i] ];
    if(typeof src == "undefined"){
      errorNames.push(urls[i]+ " not exists");
      i++;
      continue;
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = N3D.Path+src;
    head.appendChild(script);

    script.onload = (function(n){
      
      return function(){
        loaded++;
        if(n==length){
          if(loaded == length){
            callbacks.complete();
          }else{
            callbacks.error(errorNames.join("\n"));
          }
          callbacks.success();
        }
      }
    })(i+1);
    script.onerror = function(){
      return false;
    }
    i++;
  }
 
  return callbacks;
};