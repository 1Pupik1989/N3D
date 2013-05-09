var N3D = {
  Math:{},
  Graphics:{},
  Game:{},
  Utils:{},
  Geometry:{},
  Files:{},
  librariesAvailable:{
    "Math.Main":"math.main.js",
    "Math.Matrix3":"math.matrix3.js",
    "Math.Matrix4":"math.matrix4.js",
    "Math.Units":"math.units.js",
    "Math.Vector2":"math.vector2.js",
    "Math.Vector3":"math.vector3.js",
    "Math.Vector3.Test":"math.vector3_test.js",
    "Math.Vector4":"math.vector4.js",
    "Graphics.Buffer":"graphics.buffer.js",
    "Graphics.Camera":"graphics.camera.js",
    "Graphics.Color":"graphics.color.js",
    "Graphics.Scene":"graphics.scene.js",
    "Graphics.Material":"graphics.material.js",
    "Graphics.Render":"graphics.render.js",
    "Graphics.ZBuffer":"graphics.zbuffer.js",
    "Graphics.Light":"graphics.light.js",            
    "Graphics.Shader":"graphics.shader.js",
    "Geometry.Lightning":"geometry.lightning.js",
    "Geometry.Shapes":"geometry.shapes.js",
    "Geometry.Trees":"geometry.trees.js",
    "Game.Main":"game.main.js",
    "Utils.Keys":"utils.keys.js",
    "Utils.Ajax":"utils.ajax.js",
    "Store.Cookie":"store.cookie.js",
    "Audio.Main":"audio.main.js"
  }
};

(function(f){
  var lib = f.librariesAvailable;
  f.LoadedModule = {};
  for(var i in lib){
    f.LoadedModule[i] = false;  
  }
})(N3D);

N3D.Path = (function(){
  var scripts= document.getElementsByTagName('script');

  var path = scripts[scripts.length-1].src.match(/.*\//);
  if(path){
    return path[0];
  }
  
  return ""; 
})(); 

N3D.require = function(){
  var urls = Array.prototype.slice.call(arguments);
  var length = urls.length;
  var script;
  var errorName = "prdel";
  var loaded = 0;
  var head = document.getElementsByTagName("head")[0];
  
  var domLoad = function(callback){
    if(window.addEventListener) {
      window.addEventListener("load",function() { callback(); },false);
    }else if(window.attachEvent) {
      window.attachEvent("onload",function() { callback(); });
    }else {
      window.onload=function() { callback(); };
    }
  };
  
  
  var callback = {
    complete:function(f){ this.complete = f || this.complete; return this;},
    error:function(f){ this.error = f || this.error; return this;},
    success:function(f){ this.success = f || this.success; return this;}
  };
  
  var load = (function(n){
    return function(){
      if(n == length-1){
        domLoad(function(){
          callback.success();
          callback.complete();
        });
      }
      N3D.LoadedModule[urls[name]] = true;
    }
  });
  
  var error = (function(n){
    return function(name){
      domLoad(function(){
        callback.error(errorName);
        callback.complete();
      });
    }
  });
  

    var i = 0;
    while(i<length){
      var libraryName = urls[i];
      var fileName = N3D.librariesAvailable[ urls[i] ];
      if(typeof fileName !== "undefined"){
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = N3D.Path+fileName;
        head.appendChild(script);
    
        script.onload = load(i);
        script.onreadystatechange = (function(n){
          
          return function(){
            if(script.readyState=="loaded"){
              load(n)();
            }  
          }
        })(i);
        script.onerror = error(i);
      }else{
        errorName = libraryName;
        error(i)();
     
        break;
      }
      i++; 
    }
  
  return callback;
};