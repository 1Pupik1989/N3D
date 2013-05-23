var N3D = {}; 

N3D.Modules = {
  Math:["Main","Matrix3","Matrix4","Units","Vector2","Vector3","Vector4"],
  Audio:["Main"],
  Utils:["Keys","Ajax"],
  Store:["Cookie"],  
  Graphics:["Camera","Color","Scene","Material","Render","Light","Shader"],
  Geometry:["Lightning","Shapes","Trees"],
  Game:["Main"],
  Files:["Main"],
  Help:[""]
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
    modules[i].priority = p_i;
    modules[i].all = modules[i].join(";");
    n[i] = {};
    p_i++;
  }
  
  console.log(path);
  
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
        
    function load(){
      if(urls.length == 0){ 
        if(callback.unloaded !== 0){ 
          callback.error.call(n,callback.unloaded,errors.join(","));
        }else{
          callback.success.call(n);
        } 
        
        callback.complete();
        return false; 
      }
      var name = urls[0];
      urls.splice(0,1);
      if(document.getElementById(name) !== null){ load(); return false;}
      
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = path+name.toLowerCase()+".js";
      script.id = name;  

      head.appendChild(script);
      script.onerror = (function(n){
        return function(){
          errors.push(n);
          head.removeChild(this);
          callback.unloaded++;
          load(urls);
        };
      })(name);
      
      script.onload = (function(n){
        return function(){
          callback.loaded++;
          load(urls);
        }
      })(name);
      
      
    };
    
    load(urls);
    
    
    return callback;
  };
})(N3D);