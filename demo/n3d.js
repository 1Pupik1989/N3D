var N3D = {
  viewportWidth: 800,
  viewportHeight: 600,
  viewportAspectRatio: 800/600
};

N3D.command = function(f,obj){
  obj = obj || null;

  function reinit(i){
    try{
      f.call(obj);
    }catch(e){
      if(i>10){
        throw e;
        return;
      }
      setTimeout(function(){
        reinit(i+1);
      },100);  
    }

  };


  reinit(0);
};



N3D.getPageSize = function(){
  var d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0];  
  return {
    width:window.innerWidth || e.clientWidth || g.clientWidth,    
    height:window.innerHeight|| e.clientHeight|| g.clientHeight
  };
}


N3D.init = function(){
  if(this.Support.Canvas){
    this.render = new N3D.Graphics.RenderCanvas();
    
    this.scene = new N3D.Graphics.SceneCanvas();
    document.body.appendChild(this.render.canvas);
  }

  this.camera = new N3D.Graphics.FPSCamera();
  this.camera.update(true);
  
  this.setViewport(this.viewportWidth,this.viewportHeight);
};

N3D.setViewport = function(w,h){
  this.viewportWidth = w;
  this.viewportHeight = h;
  this.viewportAspectRatio = w/h;
  this.render.setViewport(w,h);  
  this.camera.update(true);  
};

N3D.autoresize = function(){
  var that = this;
  
  window.onresize = function(){
    var size = that.getPageSize();
    that.setViewport(size.width,size.height);
  };
  
  window.onresize();
};

(function(){

var timer = (function(){
  var t = 1000/60;
  
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function( callback ){
           window.setTimeout(callback, t);
         }; 
 
})();

N3D.mainLoop = function(){
  var that = this;
  
  this.render.clear();
  this.camera.update();
  this.update();
  this.scene.update(this.render,this.camera);
  
  timer(function(){
    that.mainLoop();
  });
};

})();

N3D.add = function(o){}; ///?


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
    for(var i=0,length=types.length;i<length;i++){
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

 
  
function load(urls){
  if(urls.length <= 0){
    if(N3D.onsuccess){
      N3D.onsuccess();
    }else{
      if(N3D.onerror){ N3D.onerror(); }
    }
    return;
  }
  var url = urls[0];
  urls.shift();
 
  if(document.getElementById(url) != null){ loader(urls); return false;}

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = url;
  script.src = abs_path+url+'.js';
  
  
  script.onreadystatechange = function(){ //Dodělat zachytávání chyby 404
    if(script.readyState == 'complete' || script.readyState == 'loaded'){
      script.onreadystatechange = null;

      load(urls);        
    }
  };
  
  script.onerror = function(){
    if(N3D.onerror){ N3D.onerror('Missing library file "'+url+'"'); };
    head.removeChild(this);
    return false;
  };
    
  script.onload = function(){
    load(urls);
  };
  
  head.appendChild(script);
};


N3D.require = function(){
  var urls = Array.prototype.slice.call(arguments);

  load(urls);
  N3D.require = function(){};
  
  return this;
};

})();
