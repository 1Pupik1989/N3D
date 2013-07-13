var N3D = {
  Support:{}  
};

function extend(child,parent){
  var F = function(){};
  F.prototype = parent.prototype;
  child.prototype = new F(); 
  child.prototype.constructor = child; 
  return child.prototype;                                   
};

(function(o){
  var canvas = document.createElement('canvas');
  var is2D = false, isWebGL = false, isSVG = false, isVML = false;

  //Support Canvas
  if(typeof CanvasRenderingContext2D !== 'undefined'){ 
    is2D = true; 
  }else{
    try{
      canvas.getContext("2d");
      is2D = true;
    }catch(e){}
  }
  
  //Support WebGL
  var types = ['webgl','experimental-webgl'];
  var length = types.length;
  if(typeof WebGLRenderingContext !== 'undefined'){
    isWebGL = true;
  }else{
    for(var i=0;i<length;i++){
      try{
        var ctx = canvas.getContext(types[i]);
      
        isWebGL = true;
        break;
      }catch(e){}  
    }
  }
  
  //Support SVG
  if(typeof SVGSVGElement !== 'undefined'){
    isSVG = true;
  }else if(document.createElement('svg').getAttributeNS){
    isSVG = true;
  }else if(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect){
    isSVG = true;
  }
 
  var body = document.body || document.createElement('body');
 
  var a = body.appendChild(document.createElement('div'));
  a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
  var b = a.firstChild;
  b.style.behavior = "url(#default#VML)";
  isVML = b ? typeof b.adj == "object": true;
  a.parentNode.removeChild(a);
  
  
  o.SVG = isSVG; 
  o.Context2D = is2D;
  o.WebGL = isWebGL;
  o.VML = isVML;
  
  o.toString = function(){
    return 'Context 2D: '+is2D+'\n' + 
           'WebGL: '+isWebGL+'\n' + 
           'SVG: '+isSVG+'\n' +
           'VML: '+isVML;
  };
})(N3D.Support);

(function(){
  var priority = 0;
  
  function Module(name,o){
    var ch = this.children = {};
    this.childrenArray = o;
    if(o instanceof Array){
      var length = o.length;
      for(var i=0;i<length;i++){
        ch[o[i]] = i;
      }
    }
    this.name = name;
    this.priority = priority++;
  };
  Module.prototype = {
    get:function(name){
      var o = [];
      var that_name = this.name;
      if(name == '*'){ 
        for(var i in this.children){
          o.push(that_name+'.'+i);
        }
        return o; 
      }else if(typeof this.children[name] !== 'undefined'){
        o.push(that_name+'.'+name);
      }
      
      return o;
    }
  };
  N3D.Modules = function(){
    this.children = {};
    this.act = {};
    this.toLoad = [];
  };
  N3D.Modules.prototype = {
    add:function(name,children){
      this.children[name] = new Module(name,children);
      N3D[name] = {};
    },
    get:function(name){
      var name = name.split('.');
      var lib = this.children[name[0] ];
      if(typeof lib == 'undefined'){ return false; }
      
      if(name.length == 2){
        var o = lib.get(name[1]);
        this.toLoad = this.toLoad.concat(o);
        return o.length !== 0;
      }
      
      return true;
    }
  };
  
  N3D.Modules = new N3D.Modules;

  var head = document.getElementsByTagName("head")[0];
  var master_script = document.getElementsByTagName('script');
  master_script = master_script[master_script.length-1];
  var abs_path = master_script.src.match(/.*\//);
  abs_path = abs_path ? abs_path[0] : '/';
  
  var slice = Array.prototype.slice;
  var mods = N3D.Modules.children;
  
  N3D.require = function(){
    var urls = slice.call(arguments);
    var length = urls.length;

    urls.sort(function(a,b){
      
      var name_a = a.split(".");
      var name_b = b.split(".");
      var a = mods[name_a[0]];
      var b = mods[name_b[0]];

      
      if(a.priority == b.priority){
        return a.children[ name_a[1] ] - b.children[ name_b[1] ];
      }

      return a-b;
    });


    for(var i=0;i<length;i++){
      N3D.Modules.get(urls[i]);  
    }

    urls = N3D.Modules.toLoad;
    length = urls.length;
    
    var callback = {
      complete : function(f){  this.complete = f || this.complete; return this; },
      error : function(f){ this.error = f || this.error; return this; },
      success : function(f){ this.success = f || this.success; return this; },
      loaded:[],
      unloaded:[],
      total:length
    };
    
    function loader(){
      if(urls.length == 0){
        if(callback.loaded.length == length && callback.unloaded.length == 0){
          callback.success();
        }else{
          callback.error('Not loaded scripts: '+callback.unloaded.join(', '),callback.unloaded.length);
        }
        callback.complete();
        return false;
      }
      var src = urls[0];
      urls.splice(0,1);
      
      if(document.getElementById(src) !== null){ loader(); return false; }
     
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = src;
      script.src = abs_path+src.toLowerCase()+'.js';
      
      script.onerror = function(){
        callback.unloaded++;
        loader();
      };  
      
      if(script.readyState){
        script.onreadystatechange = function(){
          if(script.readyState == 'loaded' || script.readyState == 'complete'){
            script.onreadystatechange = null;
            var name = src.split('.');

            if(name[1] == 'Main'){ callback.loaded.push(src); loader(); return false; } //pokud je sub-knihovna 'Main'

            if(typeof N3D[name[0]][ name[1] ] !== 'undefined'){  
              callback.loaded.push(src);
            }else{
              callback.unloaded.push(src); 
            }
            loader();
          }
        };
      }else{
        script.onload = function(){
          callback.loaded.push(src);
          loader();
        };
      }
      
                                         
      
      head.appendChild(script);
    }
    
    loader();
    return callback;
  };
  
})();


N3D.Modules.add('Help');
N3D.Modules.add('Variable',["Main","RegExp"]);
N3D.Modules.add('Math',["Main","Matrix3","Matrix4","Units","Vector2","Vector3","Vector4"]);
N3D.Modules.add('Audio',["Main"]);
N3D.Modules.add('Utils',["Keys","Ajax"]);
N3D.Modules.add('Graphics',["Camera","Color","Scene","Material","Render","Light","Shader"]);
N3D.Modules.add('Geometry',["Lightning","Shapes","Trees"]);
N3D.Modules.add('Game',["Main"]);
N3D.Modules.add('Files',["Main"]);