var N3D = {}; 

N3D.Modules = {
  Math:["Main","Matrix3","Matrix4","Units","Vector2","Vector3","Vector4"],
  Audio:["Main"],
  Utils:["Keys","Ajax"],
  Store:["Cookie"],  
  Graphics:["Camera","Color","Scene","Material","Render","Light","Shader"],
  Geometry:["Lightning","Shapes","Trees"],
  Game:["Main"],
  Files:["Main"]
};

(function(){
  var mods = N3D.Modules;
  var m = N3D.mod_priority = {};
  var n = 0;
  for(var i in mods){
    N3D[i] = {};
    m[i] = n++;
  }
 
})();

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
  var mods = N3D.Modules;
  var head = document.getElementsByTagName("head")[0];
  var priority = N3D.mod_priority; 
  var callback = {
    complete : function(f){  this.complete = f || this.complete; },
    error : function(f){ this.error = f || this.error; },
    success : function(f){ this.success = f || this.success; }
  };
  
  var onload = (function(){
    var load;
    if(window.addEventListener) {
      return function(callback){
        window.addEventListener("load",function(){ callback(); } ,false);  
      };
    }else if(window.attachEvent){
      return function(callback){
        window.attachEvent("onload",callback);
      }  
    }else{
      return function(callback){
        window.onload = callback;
      }
    }
  })();

  urls.sort(function(a,b){
    var _a = priority[a.split(".")[0]];
    var _b = priority[b.split(".")[0]];
        
    if(_a == _b){ return a-b; }
    return _a-_b;
  });

  urls = urls.join(";");
  var find = urls.match(/(\w+)(?=\.\*)/g);
  if(find){
    var f_length = find.length;

    for(var i=0;i<f_length;i++){
      var name = find[i];
      if(typeof mods[name] !== "undefined"){
        urls = urls.replace(new RegExp(name+"\.\\w+[;]","g"),"");
        urls = urls.replace(new RegExp(name+"\\.\\*",""),name+"."+mods[name].join(";"+name+"."));
      }
    }

  }
  urls = urls.split(";");  
  
  function call(func,src){
    setTimeout(function(){ callback[func](src); },100);
  };  
  
  var script;
  var length = urls.length;
  
  var loaded = 0;
   
  for(var i=0;i<length;i++){
    var url = urls[i];
    n = url.split(".");
    
    if(typeof mods[ n[0] ] == "undefined") { call("error",url); break; }
    if(mods[ n[0] ].indexOf(n[1]) == -1) { call("error",url); break; } 
    
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = N3D.Path+(url+".js").toLowerCase();
    
    head.appendChild(script);
    
    script.onload = (function(n){
      return function(){
        if(n+1>=length){
          onload(callback.success);
        }
        loaded++;
      }
    })(i);
    
    script.onerror = function(){
      head.removeChild(script);
      callback.error();
      return false;
    };
  }
  
  call("complete");   
  
  delete N3D.mod_priority;

  return callback;  
};