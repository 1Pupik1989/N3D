var N3D = {};

function extend(child,parent){
  var F = function(){};
  F.prototype = parent.prototype;
  child.prototype = new F(); 
  child.prototype.constructor = child; 
  return child.prototype;                                   
};

/* >>>> Detect support graphics render >>>> */ 
(function(){
  var canvas = document.createElement('canvas');
  var isCanvas = false, isWebGL = false, isSVG = false, isVML = false;

  //Support Canvas
  if(typeof CanvasRenderingContext2D !== 'undefined'){ 
    isCanvas = true; 
  }else{
    try{
      canvas.getContext("2d");
      isCanvas = true;
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
 
  //Support VML
  var body = document.body || document.createElement('body');
  var a = body.appendChild(document.createElement('div'));
  a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
  var b = a.firstChild;
  b.style.behavior = "url(#default#VML)";
  isVML = b ? typeof b.adj == "object": true;
  a.parentNode.removeChild(a);

  N3D.Support = {
    SVG:isSVG,
    Canvas:isCanvas,
    WebGL:isWebGL,
    VML:isVML,
    toString:function(){
      return 'Context 2D: '+isCanvas+'\n' + 
             'WebGL: '+isWebGL+'\n' + 
             'SVG: '+isSVG+'\n' +
             'VML: '+isVML;
    }  
  };
/* <<<< Detect support graphics render <<<< */

  var head = document.getElementsByTagName("head")[0];
  var master_script = document.getElementsByTagName('script');
  master_script = master_script[master_script.length-1];
  var abs_path = master_script.src.match(/.*\//);
  abs_path = abs_path!=null ? abs_path[0] : '/';
  
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
    return false;
  };
  
  N3D.settings = {
    abs_path: abs_path,
    autoload:(getAttr(master_script,'autoload') == 'true'),
    require_lib:getAttr(master_script,'require'),
    master_script:master_script,
    head:head
  };
  
  /* >>>> Controller for modules >>>> */
  var store_modules = {};
  
  var total_modules = [];
  var major_modules = {};
  
  var priority = {};
  var priority_i = 0;
  
  var mods = N3D.Modules = {
    add:function(name,sub_lib){
      var p = major_modules[name] = [];
      var func = N3D[name] = function(){
        throw new Error(lib+' not loaded');
      };
      
      if(sub_lib instanceof Array){
        var libs_lib;
        var o = store_modules[name+'.*'] = [];
        
        var sub_priority_i = 0;
        for(var i=0,length=sub_lib.length;i<length;i++){
          s_lib = sub_lib[i];
          lib = name+'.'+s_lib;

          store_modules[lib] = true;
          o.push(lib);

          p.push(s_lib);
          func[s_lib] = (function(name,lib){
            return function(){
              throw new Error('N3D.'+name+'.'+lib+' not loaded.');
            }
          })(name,s_lib);
          priority[lib] = priority_i+sub_priority_i;
          sub_priority_i += 0.00001;         
        }
        total_modules = total_modules.concat(o);
      }else if(typeof sub_lib == 'undefined'){
        store_modules[name] = true;
        priority[name] = priority_i;
        total_modules.push(name);
      }

      
      priority_i++;
    },
    get:function(name){
      var s_name = name.split(/\./);
      var mod = store_modules[name];
      
      if(typeof mod !== 'undefined'){ return (mod == true ? [name] : mod); }
      
      if(name == '*'){ 
        return total_modules; 
      }
      
      if(name == 'RegExp'){
        var regex = [];
        for(var i in major_modules){
          var m = major_modules[i];
          regex.push(i);              
        }

        return 'N3D\\.('+regex.join('\|')+')\\.?(\\w*)';
      }
      
      return [];
    }
  };
  /* <<<< Controller for modules <<<< */

  /* >>>> Require files to DOM >>>> */  
  function require(urls,callback){
    var is_loaded = {};
    function loader(){
      if(urls.length == 0){
        callback(true);
        return false;
      }
      
      var src = urls[0];
      urls.splice(0,1);      
            
      if(script = document.getElementById(src)){ loader(); return false; }
      
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = src;
      script.src = abs_path+src.toLowerCase()+'.js';
      
      script.onreadystatechange = function(){
        if(script.readyState == 'loaded' || script.readyState == 'complete'){
          script.onreadystatechange = null;
          /*Je načtený opravdu?*/
          loader();
        }
      };
      
      script.onload = function(){
        //Pokud sub-knihovna je závislá na jiné, tak jí tady vložit.
        loader();
      };        
      
      head.appendChild(script);
    };

    loader(urls);
  };
  
  
  N3D.require = function(){
    var urls = Array.prototype.slice.call(arguments);
    var callback = {
      complete: function(f){ this.complete = f || this.complete; },
      success: function(f){ this.success = f || this.success; },
      error: function(f){ this.error = f || this.error; },
    };
        
    var load_lib = [];

    for(var i=0,length=urls.length;i<length;i++){
      name = urls[i];
      load_lib = load_lib.concat(mods.get(name));
    }   
    
    load_lib.sort(function(a,b){
      return priority[a] - priority[b];  
    });     
        
    require(load_lib,function(isOk){
      if(isOk){
        callback.success();
      }else{
        callback.error();
      }
      callback.complete();
    });

    return callback; 
  };
  /* <<<< Require files to DOM <<<< */
})();

/* >>>> Add available library >>>> */   
N3D.Modules.add('Help');
N3D.Modules.add('Variable',["Main","RegExp"]);
N3D.Modules.add('Math',["Main","Matrix3","Matrix4","Units","Vector2","Vector3","Vector4"]);
N3D.Modules.add('Audio',["Main"]);
N3D.Modules.add('Utils',["Keys","Ajax"]);
N3D.Modules.add('Graphics',["FPSCamera","Color","Scene","Material","Render","Light","Shader"]);
N3D.Modules.add('Geometry',["Lightning","Shapes","Trees"]);
N3D.Modules.add('World',["Main"]);
//N3D.Modules.add('Files',["Main"]);
/* <<<< Add available library <<<< */  

(function(){
  var mods = N3D.Modules;
  var settings = N3D.settings;  
  var master_script = settings.master_script;
  
  if(settings.require_lib !== false){ //If set "require" attribute
    var load = N3D.require.apply(null,settings.require_lib.split(','));
    load.success(function(){
      var script = document.createElement('script');
      
      
      script.type = 'text/javascript';
      script.innerHTML = master_script.innerHTML;
                                              
      master_script.parentNode.removeChild(master_script);
      settings.head.appendChild(script);
    });
  }
})();