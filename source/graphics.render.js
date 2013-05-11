N3D.Graphics.Render = function(){};
N3D.Graphics.Render.prototype = {
  appendTo:function(el){
    el.appendChild(this.canvas);
  },
  autoResize:function(){
    var that = this;
    window.onresize = function(){
      that.parent.camera.update(true);
      that.setFullsize();
    }
  },
  add:function(o){
    if(o instanceof N3D.Graphics.Shader){
      this.shader = o;
      o.render = this;
    }
  }
};

N3D.Graphics.Render2D = function(){
  this.init();
};
N3D.Graphics.Render2D.prototype = new N3D.Graphics.Render();
N3D.Graphics.Render2D.prototype.clear = function(){
  this.context.clearRect(0,0,this.parent.viewport.width,this.parent.viewport.height);
};

N3D.Graphics.Render2D.prototype.setViewport = function(w,h){
  this.canvas.width = w;
  this.canvas.height = h;  
};

N3D.Graphics.Render2D.prototype.init = function(){
  this.complete = false;
  var ctx,bufferCtx;
  var canvas = document.createElement("canvas");
  
  try{
    ctx = canvas.getContext("2d");
  }catch(e){}
  
  if(!ctx){
    alert("Your browser not supported Canvas");
    return false;
  }

  this.canvas = canvas;
  this.context = ctx;
  this.complete = true;
};

N3D.Graphics.Render3D = function(attr){
  var attr = attr || {};
  this.uniforms = {};

  return this.init();  
};


N3D.Graphics.Render3D.prototype = new N3D.Graphics.Render();
N3D.Graphics.Render3D.prototype.constructor = N3D.Graphics.Render3D;

N3D.Graphics.Render3D.prototype.setViewport = function(w,h){
  this.context.viewport(0,0,this.canvas.width = w,this.canvas.height = h);
};
N3D.Graphics.Render3D.prototype.clear = function(){
  var ctx = this.context;
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
};
N3D.Graphics.Render3D.prototype.init = function(){
  this.complete = false;
  var canvas = document.createElement("canvas");
  var ctx;
   
  var names = [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ];
  for (var i=0; names.length>i; i++) {
    try { 
      ctx = canvas.getContext(names[i]);
      if (ctx) { break; }
    } catch (e) { }
  }

  if(!ctx) {
    //console.log("Your browser not supported 3D Canvas");
    
    return false;
  }
  
  
  ctx.clearColor(0, 0, 0, 0);
  ctx.clearDepth(1.0);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);
  ctx.clear(ctx.DEPTH_BUFFER_BIT);
  
  this.canvas = canvas;
  this.context = ctx;
  this.initShaders();
  this.complete = true;
  
  return this;
};
N3D.Graphics.Render3D.prototype.initShaders = function(){
  var ctx = this.context;
  this.shader = new N3D.Graphics.Shader(); 
  this.shader.init(this.context);
  var shaderProgram = ctx.createProgram();
  ctx.attachShader(shaderProgram, this.shader.vertexShader);
  ctx.attachShader(shaderProgram, this.shader.fragmentShader);
  ctx.linkProgram(shaderProgram);

  if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {
    console.log("Could not initialise shaders");
    return false;
  }

  ctx.useProgram(shaderProgram);
  this.shaderProgram = shaderProgram;
  this.shader.setParameters(this);
};

//$Render2D = N3D.Graphics.Render2D;
//$Render3D = N3D.Graphics.Render3D;