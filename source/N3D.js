var N3D = {
  Models:{},
  GetPageSize:function(){
    var d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0];  
    return {
      width:window.innerWidth || e.clientWidth || g.clientWidth,    
      height:window.innerHeight|| e.clientHeight|| g.clientHeight
    };
  }
};
N3D.Error = function(name,message) {
    this.name = name;
    this.level = "Show Stopper";
    this.message =      message; 
    this.htmlMessage =  message;
};  
N3D.Error.prototype.toString =  function(){return this.name + ": " + this.message};

function extend(child,parent){
  var F = function(){};
  F.prototype = parent.prototype;
  child.prototype = new F(); 
  child.prototype.constructor = child; 
  return child.prototype;                                   
};


(function(){
  var head = document.getElementsByTagName("head")[0];
  var master_script = document.getElementsByTagName('script');
  master_script = master_script[master_script.length-1];
  var abs_path = master_script.src.match(/.*\//);
  abs_path = abs_path ? abs_path[0] : '/';

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
  
  
function load(urls,callbacks){
  if(urls.length <= 0){
    if(callbacks.unloaded.length == 0){
      callbacks.success();
    }else{
      callbacks.error();
    }
    callbacks.complete();
    return;
  }
  var url = urls[0];
  urls.shift();
 
  if(document.getElementById(url) != null){ loader(urls,callbacks); return false;}

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = url;
  script.src = abs_path+url+'.js';
  head.appendChild(script);

  script.onreadystatechange = function(){
    if(script.readyState == 'loaded' || script.readyState == 'complete'){
      this.onreadystatechange = null; 
        
      load(urls,callbacks);        
    }
  };
  
  script.onerror = function(){
    callbacks.unloaded.push(this.id+' missing library file,'+this.src+' not a file'); 
    load(urls,callbacks);
    head.removeChild(this);
    return false;
  };
    
  script.onload = function(){
    load(urls,callbacks);
  };
};


N3D.require = function(){
  var urls = Array.prototype.slice.call(arguments);
  var callbacks = {
    complete: function(f){ this.complete = f || this.complete; },
    success: function(f){ this.success = f || this.success; },
    error: function(f){ this.error = f || this.error; },
    unloaded:[]
  };

  load(urls,callbacks);
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
    
    var req_load = N3D.require.apply(null,require.split(','));
    req_load.success(function(){
      var script = document.createElement('script');
      script.type = 'text/javascript';
     
      script.text = master_script.innerHTML;
      head.appendChild(script);
      
      master_script.parentNode.removeChild(master_script);
      
    });
    req_load.error(function(){
      console.log('error');
    })
  
  }
  
  N3D.SaveModel = function(name){
    var model = N3D.Models[name];
    var text = '{"vp":[1,2,3,4],"f":[0,1,2,0,2,3]}';
     
    if(model instanceof N3D.Geometry.Shapes){
      var a = document.createElement("a");
          a.download = name+'.json';
          a.href = 'data:text/javascript;charset=utf-8,'+text;
          a.style.display = "none";
          a.onclick = function(event){
            var event = event || window.event;
            var target = event.target || event.srcElement;
            document.body.removeChild(event.target);
          };
		
          document.body.appendChild(a);
          a.click();
      throw new N3D.Error('Model Exporter','export was successful');  
    }else{
      throw new N3D.Error('Model Exporter','Model "'+name+'" not found');
    }
  };

})();