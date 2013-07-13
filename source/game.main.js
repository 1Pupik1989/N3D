N3D.Viewport = function(){
  this.width = 800;
  this.height = 600;
  this.aspectRatio = 800/600;
  
};
N3D.Viewport.prototype = {
  constructor: N3D.Viewport,
  set:function(w,h){
    this.width = w;
    this.height = h;
    this.aspectRatio = w/h;
  }
};

var World = function(attr){
  var settings = attr || {};
  settings.type = settings.type || '2D';
  
  this.add(new N3D.Viewport());
  this.add(new N3D.Graphics.FPSCamera());
  this.settings = settings;
  
  this.setMode(attr.type);
  
};
World.prototype = {
  render:null,
  scene:null,
  destruct:function(){
    for(var i in World.prototype){
      this[i] = function(){};
    }
  },
  add:function(o){
    if(typeof o == 'undefined'){ return false; }
    o.parent = this;
    if(o instanceof N3D.Geometry.Shapes){
      o.init();
      o.bindBuffer();
      this.scene.models.push(o);      
    }else if(o instanceof N3D.Graphics.Render){
      if(this.render !== null){
        this.render.remove();
      }
      o.init();

      o.appendTo(document.body);
      o.autoResize(); 
      this.render = o;
    }else if(o instanceof N3D.Graphics.Scene){
       this.scene = o;
    }else if(o.constructor == N3D.Viewport){
      this.viewport = o;
    }else if(o.constructor == N3D.Graphics.Camera){
      this.camera = o;
      o.update(true);
    }
  },
  setMode:function(type){
    var render, scene;
    var old_render = this.render;
    var old_scene = this.scene;
    var shaders = null;
    
    switch(type){
      case '2D': 
        render = new N3D.Graphics.Render2D();
        scene = new N3D.Graphics.Scene2D(); 
        break;
      case 'Pseudo3D':
        render = new N3D.Graphics.Render2D();
        scene = new N3D.Graphics.Scene2D(); 
        break;
      case '3D':
        render = new N3D.Graphics.Render3D({
          shaders:shaders
        });
        scene = new N3D.Graphics.Scene3D();
        break;
      case 'SVG':
        render = new N3D.Graphics.RenderSVG();
        scene = new N3D.Graphics.SceneSVG();
        break;
      default:
        render = new N3D.Graphics.Render2D();
        scene = new N3D.Graphics.Scene2D(); 
        break;
    }; 

    this.add(render);
    this.add(scene);
    
    if(old_scene !== null){
      var models = old_scene.models;
      var length = models.length
      for(var i=0;i<length;i++){
        this.add(models[i]);
      }
    }

    if(this.settings.autoResize == true){
      this.autoResize();
    }
  },
  resize:function(w,h){
    this.viewport.set(w,h);
    this.render.setViewport(w,h);
    this.camera.update(true);
    this.scene.update(true);
  },
  autoResize:function(){
    var that = this;
    that.resize(window.innerWidth,window.innerHeight);
    window.onresize = function(){
      that.resize(window.innerWidth,window.innerHeight);
      //
      
    }
  },
  beforeUpdate:function(){},
  update:function(){
    this.beforeUpdate();
    var that = this;
    
    this.render.clear();    
    this.camera.update();
    
    this.scene.update();
    /*timer(function(){
      that.update();
    });*/
  }
};

var timer = (function(){
  var t = 1000/60;
  
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function( callback ){
           window.setTimeout(callback, t);
         };
})();