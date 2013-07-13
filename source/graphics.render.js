N3D.Graphics.Render = function(){};
N3D.Graphics.Render.prototype = {
  backfaceCulling: true,
  shaders: null,
  shaderProgram: {},
  autoResize: function(){
    var that = this;
    window.onresize = function(){
      that.parent.camera.update(true);
      that.setFullsize();
    };
  },
  remove: function(){
    var c = this.canvas;
    c.parentNode.removeChild(c);
  },
  appendTo: function(el){
    this.dom = el;
    el.appendChild(this.canvas);
  },
  add: function(o){
    if(o instanceof N3D.Graphics.Shader){
      var gl = this.context;
      var shaderProgram = gl.createProgram();
    
      this.shaders = o;
      N3D.Graphics.Render.shaders = o;

      this.shaders.vertex = bindShader(gl,o.vertexSource,gl.VERTEX_SHADER);
      this.shaders.fragment = bindShader(gl,o.fragmentSource,gl.FRAGMENT_SHADER);
   
      gl.attachShader(shaderProgram,this.shaders.vertex);
      gl.attachShader(shaderProgram,this.shaders.fragment);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program.');
      }
  
      gl.useProgram(shaderProgram);
      this.shaderProgram = shaderProgram;
    
      this.shaders.bind(this);
    }
  }
};

//---- Render for 2D & 2.5D scenes ----
N3D.Graphics.Render2D = function(){
  this.shaders = null;
  this.shaderProgram = {};
};
N3D.Graphics.Render2D.prototype = extend(N3D.Graphics.Render2D,N3D.Graphics.Render);
N3D.Graphics.Render2D.prototype.constructor = N3D.Graphics.Render;
N3D.Graphics.Render2D.prototype.clear = function(){
  var viewport = this.parent.viewport;
  this.context.clearRect(0,0,viewport.width,viewport.height); 
};
N3D.Graphics.Render2D.prototype.setViewport = function(w,h){
  this.canvas.width = w;
  this.canvas.height = h;
  this.context.setTransform(1,0,0,-1,0,h);
};

N3D.Graphics.Render2D.prototype.init = function(){
  if(!N3D.Support.Context2D){ throw new Error('Your browser not supported Canvas'); }
  var ctx,bufferCtx;
  var canvas = document.createElement('canvas');
  
  try{
    ctx = canvas.getContext('2d');
    
  }catch(e){
    throw new Error("Your browser not supported Canvas");
    return false;
  }
  
  this.canvas = canvas;
  this.context = ctx;

  N3D.Geometry.Shapes.Triangle.draw = function(ctx,material){
    var specColor = material.specularColor;

    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2;

    ctx.strokeStyle = 'white';

    //ctx.fillStyle = 'rgb('+specColor.red+','+specColor.green+','+specColor.blue+')';

    ctx.beginPath();
    ctx.moveTo(vp0.x, vp0.y);
    ctx.lineTo(vp1.x, vp1.y);
    ctx.lineTo(vp2.x, vp2.y);
    ctx.closePath();
    ctx.stroke();
    //ctx.fill();
    
  }
  
  N3D.Geometry.Shapes.Triangle.drawTexture = function(ctx,material){
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y,
        
        vt0 = this.vt0, vt1 = this.vt1, vt2 = this.vt2,
        u0 = vt0.x*512, u1 = vt1.x*512, u2 = vt2.x*512,
        v0 = (1-vt0.y)*512, v1 = (1-vt1.y)*512, v2 = (1-vt2.y)*512;

    

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();
    ctx.stroke();
    x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
    u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
    
    var id = 1 / (u1*v2 - u2*v1),
        a = id * (v2*x1 - v1*x2),
        b = id * (v2*y1 - v1*y2),
        c = id * (u1*x2 - u2*x1),
        d = id * (u1*y2 - u2*y1);

    ctx.transform( a, b, c, d, x0 - a*u0 - c*v0, (y0 - b*u0 - d*v0));
    ctx.drawImage(material.specularMap.img, 0, 0);
    
    ctx.restore();
  }
  
};  
N3D.Graphics.Render2D.prototype.toString = function(){
  return 'N3D.Graphics.Render2D';
};  
  
//---- Render for 3D scenes ----  
N3D.Graphics.Render3D = function(settings){
  var settings = settings || {};
  if(typeof settings.shader !== 'undefined'){
    N3D.Graphics.Render.shaders = settings.shaders;
  }  
};
N3D.Graphics.Render3D.prototype = extend(N3D.Graphics.Render3D,N3D.Graphics.Render);
N3D.Graphics.Render3D.prototype.constructor = N3D.Graphics.Render;

N3D.Graphics.Render3D.prototype.clear = function(){
  var ctx = this.context;
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
};
N3D.Graphics.Render3D.prototype.init = function(){
  if(!N3D.Support.WebGL){ throw new Error('Your browser not supported WebGL'); }
  var canvas = document.createElement('canvas');
  var ctx;
  var names = [ 'webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d' ];
  for (var i=0; names.length>i; i++) {
    try { 
      ctx = canvas.getContext(names[i]);
      if (ctx) { break; }
    } catch (e) { }
  }

  if(!ctx) {
    
    return false;
  }
  
  ctx.clearColor(0, 0, 0, 0);
  ctx.clearDepth(1.0);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);
  ctx.clear(ctx.DEPTH_BUFFER_BIT);
  
  this.canvas = canvas;
  this.context = ctx;

  if(N3D.Graphics.Render.shaders == null){
    this.add(new N3D.Graphics.Shader('shaders/vertex.shader','shaders/fragment.shader'));
  }else{
    this.add(N3D.Graphics.Render.shaders);
  } 
   
  return this;
};

N3D.Graphics.Render3D.prototype.setViewport = function(w,h){
  this.context.viewport(0,0,this.canvas.width = w,this.canvas.height = h);
};

N3D.Graphics.Render3D.prototype.toString = function(){
  return 'N3D.Graphics.Render3D';
};

function bindShader(gl,shaderSource,shaderType){
  var shader = gl.createShader(shaderType); 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader); 
  
  return shader;
};

N3D.Graphics.RenderSVG = function(){

};

N3D.Graphics.RenderSVG.prototype = extend(N3D.Graphics.RenderSVG,N3D.Graphics.Render);

N3D.Graphics.RenderSVG.prototype.init = function(){
  if(!N3D.Support.SVG){ throw new Error('Your browser not supported SVG'); }
  var context = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  context.setAttributeNS(null,'version','1.1');
  context.setAttribute('xmlns','http://www.w3.org/2000/svg');
  
  this.defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  this.group = document.createElementNS("http://www.w3.org/2000/svg", "g"); 
  this.context = context;
  this.canvas = context;
  
  var viewport = this.parent.viewport;
  var that = this;  
  
  context.appendChild(this.defs);
  context.appendChild(this.group);
  
  var width = 512, height = 512;
  
  //Nastavení vykreslování trojúhelníků
  N3D.Geometry.Shapes.Triangle.drawTexture = function(ctx,material,i){
    var triangle = this.triangleSVG;
    triangle.setAttributeNS(null,'opacity','1');
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y,
        
        vt0 = this.vt0, vt1 = this.vt1, vt2 = this.vt2,
        u0 = vt0.x*width, u1 = vt1.x*width, u2 = vt2.x*width,
        v0 = (1-vt0.y)*height, v1 = (1-vt1.y)*height, v2 = (1-vt2.y)*height;
    
        
    x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
    u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
    
    var id = 1 / (u1*v2 - u2*v1),
        a = id * (v2*x1 - v1*x2),
        b = id * (v2*y1 - v1*y2),
        c = id * (u1*x2 - u2*x1),
        d = id * (u1*y2 - u2*y1);
        
    triangle.setAttributeNS(null,'fill','url(#'+material.specularMap.id+')');
    triangle.setAttributeNS(null,'transform','matrix('+a+' '+b+' '+c+' '+d+' '+(x0 - a*u0 - c*v0)+' '+(y0 - b*u0 - d*v0)+')');
  };
  
  N3D.Geometry.Shapes.Triangle.draw = function(ctx){
    var triangle = this.triangleSVG;
    
    triangle.setAttributeNS(null,'opacity','1');
    
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y;
        
    triangle.setAttributeNS(null,'fill','yellow');
    triangle.setAttributeNS(null,'stroke','red');
    triangle.setAttributeNS(null,'points',x0+' '+y0+' '+x1+' '+y1+' '+x2+' '+y2);
  };
};
N3D.Graphics.RenderSVG.prototype.setViewport = function(w,h){
  this.canvas.width = w;
  this.canvas.height = h; 
  this.canvas.setAttribute("width",w);
  this.canvas.setAttribute("height",h);
  
  //this.group.setAttributeNS(null,'transform','matrix(1,0,0,-1,0,'+h+')');
};
N3D.Graphics.RenderSVG.prototype.clear = function(){

};

N3D.Graphics.Render.shaders = null;

//$Render2D = N3D.Graphics.Render2D;
//$Render3D = N3D.Graphics.Render3D;