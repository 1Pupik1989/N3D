if(typeof Float32Array === "undeifned"){
  Float32Array = WebGLFloatArray;
} 

var N3D = {}; 

N3D.Support = {};
N3D.Support.WebGL = (function(){
  if(typeof WebGLRenderingContext !== 'undefined'){ return true; }

  var canvas = document.createElement('canvas');
  var types = ['webgl','experimental-webgl'];
  var length = types.length;
  for(var i=0;i<length;i++){
    try{
      canvas.getContext(types[i]);
      return true;
    }catch(e){}  
  }
  
  return false;

})();

N3D.Support.Context2D = (function(){
  var canvas = document.createElement('canvas');
  if(typeof CanvasRenderingContext2D !== 'undefined'){ return true; }
  
  try{
    canvas.getContext("2d");
    return true;
  }catch(e){}

  return false;
})();


N3D.Modules = {
  Help:[""],
  Variable:["Main","RegExp"],
  Math:["Main","Matrix3","Matrix4","Units","Vector2","Vector3","Vector4"],
  Audio:["Main"],
  Utils:["Keys","Ajax"],
  Store:["Cookie"],  
  Graphics:["Camera","Color","Scene","Material","Render","Light","Shader"],
  Geometry:["Lightning","Shapes","Trees","Shapes_old"],
  Game:["Main"],
  Files:["Main"]    
};

(function(n){
  var callback = {
    complete : function(f){  this.complete = f || this.complete; return this; },
    error : function(f){ this.error = f || this.error; return this; },
    success : function(f){ this.success = f || this.success; return this; },
    loaded:0,
    unloaded:0,
    total:0
  };

  var path = (function(){
    var scripts= document.getElementsByTagName('script');

    var path = scripts[scripts.length-1].src.match(/.*\//);
    if(path){ return path[0]; }
  
    return ""; 
  })();
  
  var modules = N3D.Modules;
 
  var p_i=0;
  for(var i in modules){
    var mod = modules[i];
    mod.priority = p_i;
    mod.all = mod.join(";");
    n[i] = {};

    p_i++;
  }
  function loader(callback){
    if(window.addEventListener) {
      window.addEventListener("load",callback,false);
    }else if(window.attachEvent) {
      window.attachEvent("onload",callback);
    }else{
      window.onload=callback;
    }
  };
  
  function getModules(urls){
    urls.sort();
    urls = urls.join(";");
    
    var regex = /(\w+)\.?(.*?)(?=;|$)/g;
    var ignore = {};
    var complete = [];
    
    var c,result,name,sub_name;
    while((result = regex.exec(urls)) !== null){
      name = result[1];
      sub_name = result[2];
      major = modules[name];
      if(typeof major == "undefined"){ continue; }
      if(typeof ignore[name] !== "undefined"){ continue; }
      
      c = complete[major.priority];
      if(typeof c == "undefined"){ c = complete[major.priority] = [] }
      if(sub_name == "*"){
        ignore[name] = true;
        var length = major.length;

        for(var i=0;i<length;i++){
          c.push(name+"."+major[i]);
        }
      }else if(major.all.indexOf(sub_name) !== -1){
        c.push(result[0]);
      }
    }

    var store = [];
    
    for(var i in complete){
      Array.prototype.push.apply(store,complete[i]);
    }

    return store;
  };
  
  n.require = function(){
    
    var urls = getModules(Array.prototype.slice.call(arguments));
    var head = document.getElementsByTagName("head")[0];
    var length = urls.length;
    var errors = [];
    callback.total += length;
    
    if(length == 0){
      //loader(function(){
        callback.error(0,"No script");
        callback.complete(callback.loaded,callback.unloaded);
        
      //});
      return callback;
    }
        
    function load(){
      
      if(urls.length == 0){ 
        //loader(function(){
          if(callback.unloaded !== 0){ 
            callback.error.call(n,callback.unloaded,errors.join(","));
          }else{
            callback.success.call(n);
          } 
        
          callback.complete(callback.loaded,callback.unloaded);
        //});
        return false; 
      }
      
      var name = urls[0];
      urls.splice(0,1);
      if(document.getElementById(name) !== null){ load(); return false;}
      
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = path+name.toLowerCase()+".js";
      script.id = name;  

      
      
      script.onerror = (function(n){
        return function(){
          errors.push(n);
          head.removeChild(this);
          callback.unloaded++;
          load(urls);
         };
      })(name);
      
      script.onreadystatechange = function(){
        if(this.readyState == "loaded"){
          callback.loaded++;
          load();        
        }
      } 
      
      script.onload = function(){
        callback.loaded++;
        load();
      }       
      head.appendChild(script);
    };
    
    load(urls);
    
    
    return callback;
  };
})(N3D);
