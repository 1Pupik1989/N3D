var N3D = {
  Math:{},
  Graphics:{},
  Game:{},
  Utils:{},
  Geometry:{},
  librariesAvailable:{
    "Math.Main":"math.main.js",
    "Math.Matrix4":"math.matrix4.js",
    "Math.Vector2":"math.vector2.js",
    "Math.Vector3":"math.vector3.js",
    "Math.Vector4":"math.vector4.js",
    "Graphics.Camera":"graphics.camera.js",
    "Graphics.Color":"graphics.color.js",
    "Graphics.Scene":"graphics.scene.js",
    "Graphics.Texture":"graphics.texture.js",
    "Graphics.Render":"graphics.render.js",
    "Geometry.Objects3D":"geometry.objects3d.js",
    "Game.Main":"game.main.js",
    "Utils.Main":"utils.main.js",
    "Utils.Ajax":"utils.ajax.js",
    "Store.Cookie":"store.cookie.js",
    "Store.Array":"store.array.js",
    "Math.Vector3_test":"vector3_test.js"
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
  var script;
  var errorNames = [];
  var loaded = 0;
  var head = document.getElementsByTagName("head")[0];
  
  var callback = {
    complete:function(f){ this.complete = f || this.complete; return this;},
    error:function(f){ this.error = f || this.error; return this;},
    success:function(f){ this.success = f || this.success; return this;},
  }
  
  var i = 0;
  while(i<length){
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = N3D.Path+N3D.librariesAvailable[ urls[i] ];
    head.appendChild(script);
    
    var load = (function(n){
      return function(){
        loaded++;
        if(loaded == length){
          callback.success();
        }
        if(n == length){
          callback.complete();
        }
      };
    })(i+1);
    
    script.onload = load;
    script.onreadystatechange = function(){
      if (this.readyState == 'complete') load();
    }
    
    var t;
    
    script.onerror = (function(n){
      return function(){
        head.removeChild(this);
        errorNames.push(urls[n-1]);
        if(n == length){
          setTimeout(function(){
            callback.error(errorNames);
          },10);
        }
      };
    })(i+1);
    i++;
  }

  return callback;
};