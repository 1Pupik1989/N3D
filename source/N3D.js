var N3D = {};  

N3D.Modules = (function(){
  var mods = {};
  var priority = 0;
  return {
    add:function(name,libs){
      var n = N3D[name] = (function(name){
        return function(){
          throw new Error(name+' not loaded');
        }
      })(name);

      if(libs instanceof Array){
        var f,llib;
        var sub_priority = 0;
        var arr = mods[name+'.*'] = [];
        
        for(var i=0,length=libs.length;i<length;i++){
          l = libs[i];
          lib = name+'.'+l;
           
          arr.push(mods[lib] = {
            name:lib,
            src:lib.toLowerCase(),
            priority:priority+sub_priority
          });
          f = n[l] = (function(name){
            return function(){
              throw new Error(name+' not loaded');
            }
          })(l);
          sub_priority += 0.00001;
        } 
      }else{
        mods[name] = {
          name:name,
          src:name.toLowerCase(),
          priority:priority
        };
      }
      priority++;
    },
    set:function(name,arr){
      var mod = mods[name];

      if(mod instanceof Array){
        Array.prototype.push.apply(arr,mod);
      }else if(typeof mod !== 'undefined'){
        arr.push(mod);
      }          
    }
  }
})();

N3D.Modules.add('Help');
N3D.Modules.add('Math',["Main","Matrix3","Matrix4","Vector2","Vector3","Vector4"]);
N3D.Modules.add('Utils',["Ajax"]);
N3D.Modules.add('Graphics',["Color","FPSCamera","Material","Render","Scene","Shader"]);
N3D.Modules.add('Geometry',["Shapes"]);
N3D.Modules.add('World',["Main"]);

function extend(child,parent){
  var F = function(){};
  F.prototype = parent.prototype;
  child.prototype = new F(); 
  child.prototype.constructor = child; 
  return child.prototype;                                   
};

(function(){   
  /* >>>> Detect support render >>>> */           
  var supp = N3D.Support = {
    Canvas:false,
    WebGL:false,
    SVG:false,
    VML:false,
    toString:function(){
      return 'Context 2D: '+this.Canvas+'\n' + 
             'WebGL: '+this.WebGL+'\n' + 
             'SVG: '+this.SVG+'\n' +
             'VML: '+this.VML;
    } 
  };
  
  var canvas = document.createElement('canvas');
  
  /* Support Canvas */
  try{
    canvas.getContext('2d');    
    supp.Canvas = true; 
  }catch(e){} 
  
  
  /* Support WebGL */                            
  if(typeof WebGLRenderingContext !== 'undefined'){
    supp.WebGL = true;
  }else{
    var types = ['webgl','experimental-webgl'];
    for(var i=0;i<length;i++){
      try{
        var ctx = canvas.getContext(types[i]);
      
        supp.WebGL = true;
        break;
      }catch(e){}  
    }
  }
  
  /* Support SVG */
  supp.SVG = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.1")
  
  /* Support VML */
  var a = document.createElement('div');
  a.innerHTML = '<v:shape adj="1" />';
  var b = a.firstChild;
  b.style.behavior = "url(#default#VML)";
  supp.VML = b ? typeof b.adj == "object": true;
  /* <<<< Detect support render <<<< */  
  
  var head = document.getElementsByTagName("head")[0];
  var master_script = document.getElementsByTagName('script');
  master_script = master_script[master_script.length-1];
  var abs_path = master_script.src.match(/.*\//);
  abs_path = abs_path ? abs_path[0] : '/';

  var mods = N3D.Modules;
  
  function loader(urls,callbacks,error){
    if(urls.length == 0){ 
      if(callbacks.unloaded.length == 0){
        callbacks.success();
      }else{                        
        callbacks.error(callbacks.unloaded.join(','));
      }
      
      callbacks.complete();
      return;
    }
    
    var mod = urls[0];
    urls.shift();
    
    if(document.getElementById(mod.name) != null){ loader(urls,callbacks); return false;}

    N3D.isLoaded = false;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = mod.name;
    script.src = abs_path+mod.src+'.js';
    
    head.appendChild(script);

    script.onreadystatechange = function(){
      if(script.readyState == 'loaded' || script.readyState == 'complete'){
        if(!N3D.isLoaded){
          callbacks.unloaded.push(this.id+' missing library file,'+this.src+' not a file');      
          head.removeChild(this);          
        }
        this.onreadystatechange = null; 
        loader(urls,callbacks);        
      }
    };
    
    script.onerror = function(){
      callbacks.unloaded.push(this.id+' missing library file,'+this.src+' not a file');      
      loader(urls,callbacks);
      head.removeChild(this);
      return false;
    };
    
    script.onload = function(){
      loader(urls,callbacks);
    };
  };
  
  N3D.require = function(){
    var urls = Array.prototype.slice.call(arguments);
    var load_urls = [];    
    var callbacks = {
      complete: function(f){ this.complete = f || this.complete; },
      success: function(f){ this.success = f || this.success; },
      error: function(f){ this.error = f || this.error; },
      unloaded:[]
    };
    
    for(var i=0,length=urls.length;i<length;i++){
      mods.set(urls[i],load_urls);
    }
    
    loader(load_urls.sort(function(a,b){
      return a.priority-b.priority;
    }),callbacks);
    
    return callbacks;
  };   
  
  function getAttr(el, attr) {
    var result;
    if(result = el[attr]){ return result; }
    if(el.getAttribute && (result = el.getAttribute(attr))){ return result;}
    var attrs = el.attributes;
    var length = attrs.length;

    for(var i = 0; i < length; i++){
      if(attrs[i].nodeName === attr){
        return attrs[i].nodeValue;
      }
    }
    return null;
  };
  
  var require = getAttr(master_script,'require');
  
  if(require !== null){
    var load = N3D.require.apply(null,require.split(','));
    load.success(function(){
      var script = document.createElement('script');
      script.type = 'text/javascript';
     
      script.textContent = master_script.innerHTML;
      head.appendChild(script);
      master_script.parentNode.removeChild(master_script);
    });
  }
  
})();