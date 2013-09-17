/* >>>> Viewport >>>> */
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
/* <<<< Viewport <<<< */


/* >>>> World >>>> */
N3D.World = function(attr){
  var settings = attr || {};
  settings.type = settings.type || 'Canvas';
  settings.autoresize = settings.autoresize || false;

  this.add(new N3D.Viewport()).add(new N3D.Graphics.FPSCamera());
  this.settings = settings;
  
  this.setMode(settings.type);  
};
N3D.World.prototype = {
  render:null,
  scene:null,
  frame:0,
  add:function(o){
    if(typeof o == 'undefined'){ return false; }
    o.parent = this;
    if(o instanceof N3D.Graphics.Camera){
      this.camera = o.update(true);
    }else if(o instanceof N3D.Geometry.Shapes){
      this.scene.models.push(o.init().bindBuffer());      
    }else if(o instanceof N3D.Graphics.Render){
      if(this.render !== null){
        this.render.remove();
      }
      document.body.appendChild(o.init().canvas);

      this.render = o;
    }else if(o instanceof N3D_Gr_Scene){
       this.scene = o;
    }else if(o instanceof N3D.Viewport){
      this.viewport = o;
    }else if(o instanceof N3D_U_Events){
      this.events = o;
    }
    
    return this;
  },
  setMode:function(type){
    var render, scene;
    var old_render = this.render;
    var old_scene = this.scene;
    
    switch(type){
      case 'Canvas':
        render = new N3D_Gr_RenderCanvas();
        scene = new N3D_Gr_Scene(); 
        break;
      case 'WebGL':
        render = new N3D_Gr_RenderWebGL();
        scene = new N3D_Gr_SceneWebGL();
        break;
      case 'SVG':
        render = new N3D_Gr_RenderSVG();
        scene = new N3D_Gr_Scene();
        break;
      case 'VML':
        render = new N3D_Gr_RenderVML();
        scene = new N3D_Gr_Scene();
        break;  
      default:
        render = new N3D_Gr_RenderCanvas();
        scene = new N3D_Gr_Scene(); 
        break;
    }; 

    this.add(render);
    this.add(scene);
    
    if(old_scene !== null){
      var models = old_scene.models;
      for(var i=0,length = models.length;i<length;i++){
        this.add(models[i]);
      }
    }

    if(this.settings.autoresize == true){
      this.autoResize();
    }
  },
  resize:function(w,h){
    this.viewport.set(w,h);
    this.render.setViewport(w,h);
    this.camera.update(true);
    this.scene.update();
  },
  autoResize:function(){
    var that = this;
    var size = N3D.GetPageSize();
    that.resize(size.width,size.height);

    window.onresize = function(){
      size = N3D.GetPageSize();
      that.resize(size.width,size.height);
    };
  },
  beforeUpdate:function(){},
  update:function(){
    
    var that = this;
    this.beforeUpdate();
    this.render.clear();    
    this.camera.update();
    
    this.scene.update();
    this.frame++;
    /*timer(function(){
      that.update();
    });*/
  }
};
/* <<<< World <<<< */


var timer = (function(){
  var t = 1000/60;
  
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function( callback ){
           window.setTimeout(callback, t);
         };
})();