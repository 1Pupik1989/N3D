N3D.Graphics = {};

/* >>>> Graphics.Camera >>>> */
N3D.Graphics.Camera = function(){};
N3D.Graphics.Camera.prototype = {
  constructor:N3D.Graphics.Camera,
  fov:45,
  near:1,
  far:1000,
  updateStatus:false,
  update:function(update){
    if(update || this.updateStatus){
      var target = N3D_M_Vector3.Sub(this.position,this.direction);
      this.projectionViewMatrix = N3D_M_Matrix4.Multiply(
        this.viewMatrix = N3D_M_Matrix4.CreateLookAt(this.position,target,N3D_M_Vector3.Up),
        this.projectionMatrix = N3D_M_Matrix4.CreatePerspective(this.fov,this.parent.viewport.aspectRatio,this.near,this.far)
      );

      this.updateStatus = false;
    }
    return this;
  }
};

N3D.Graphics.FPSCamera = function(fov,near,far){
  if(fov){  this.fov = fov; }
  if(near){ this.near = near; }
  if(far){  this.far = far; }
    
  this.position = new N3D_M_Vector3(0,0,10);
  this.viewMatrix = new N3D_M_Matrix4();
  this.direction = new N3D_M_Vector3(0,0,1);  
  
  return this;
}; 
N3D.Graphics.FPSCamera.prototype = extend(N3D.Graphics.FPSCamera,N3D.Graphics.Camera);


N3D.Graphics.FPSCamera.prototype.toString = function(){
  var str = "N3D.FPSCamera(\n";
  str += "  Field of view: "+this.fieldOfView+",\n";
  str += "  Aspect ratio: "+this.parent.viewport.aspectRatio.toFixed(4)+",\n";
  str += "  Near clip plane: "+this.nearPlane+",\n";
  str += "  Far clip plane: "+this.farPlane+"\n";
  str += ");";
  return str;
};

/* <<<< Graphics.Camera <<<< */



/* >>>> Graphics.Render >>>> */
(function(){
/* >>>> Additional functions >>>> */
  function bindShader(gl,shaderSource,shaderType){
    var shader = gl.createShader(shaderType); 
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader); 
  
    return shader;
  };

  function drawCanvas(ctx,shape){

    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2;

    ctx.strokeStyle = 'black'; ctx.fillStyle = shape.specular_color;

    ctx.beginPath();
    ctx.moveTo(vp0.x, vp0.y);
    ctx.lineTo(vp1.x, vp1.y);
    ctx.lineTo(vp2.x, vp2.y);
    ctx.closePath();
    ctx.stroke();
    //ctx.fill();    
  };
  
  function drawTextureCanvas(ctx,shape){
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y,
        width = shape.texture_width, height = shape.texture_height,
        vt0 = this.vt0, vt1 = this.vt1, vt2 = this.vt2,
        u0 = vt0.x*width, u1 = vt1.x*width, u2 = vt2.x*width,
        v0 = (1-vt0.y)*height, v1 = (1-vt1.y)*height, v2 = (1-vt2.y)*height;
        

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    //ctx.stroke();
    ctx.clip();

    x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
    u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
    
    var id = 1 / (u1*v2 - u2*v1),
        a = id * (v2*x1 - v1*x2),
        b = id * (v2*y1 - v1*y2),
        c = id * (u1*x2 - u2*x1),
        d = id * (u1*y2 - u2*y1);

    ctx.transform( a, b, c, d, x0 - a*u0 - c*v0, (y0 - b*u0 - d*v0));
    ctx.drawImage(shape.specular_texture, 0, 0);
    
    ctx.restore();
  };

  function drawTextureSVG(render,shape){
    var triangle = this.triangleSVG;
    triangle.setAttributeNS(null,'opacity','1');
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y,
        width = shape.texture_width, height = shape.texture_height,
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

        
    triangle.setAttributeNS(null,'fill','url(#spec-'+shape.specular_map.index+')');
    triangle.setAttributeNS(null,'transform','matrix('+a+' '+b+' '+c+' '+d+' '+(x0 - a*u0 - c*v0)+' '+(y0 - b*u0 - d*v0)+')');
  };
  
  function drawSVG(){
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
  
  function drawVML(ctx){
    var triangle = this.triangleVML;
    
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y;
    
    triangle.path = 'm '+x0+' '+y0+' l '+x1+' '+y1+' '+x2+' '+y2+' x e';
  };
  
  function drawTextureVML(render,shape){
    var triangle = this.triangleVML;
    
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y,
        width = shape.texture_width, height = shape.texture_height,
        vt0 = this.vt0, vt1 = this.vt1, vt2 = this.vt2,
        u0 = Math.floor(vt0.x*width), u1 = Math.floor(vt1.x*width), u2 = Math.floor(vt2.x*width),
        v0 = Math.floor((1-vt0.y)*height), v1 = Math.floor((1-vt1.y)*height), v2 = Math.floor((1-vt2.y)*height);
      
    //triangle.path = 'm '+x0+', '+y0+' l '+x1+', '+y1+' '+x2+', '+y2+' x e';


    //triangle.path = 'm '+u0+', '+v0+' l '+u1+', '+v1+' '+u2+', '+v2+' x e';
    x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
    u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
    
    var id = 1 / (u1*v2 - u2*v1),
        a = id * (v2*x1 - v1*x2),
        b = id * (v2*y1 - v1*y2),
        c = id * (u1*x2 - u2*x1),
        d = id * (u1*y2 - u2*y1)
        e = (x0 - a*u0 - c*v0),
        f = (y0 - b*u0 - d*v0); 
        
    triangle.style.display = 'block';
    triangle.style.width = 100;
    triangle.style.height = 100;
    //SizingMethod='auto expand',
    
    //triangle.strokecolor = 'red';
    //triangle.fillcolor = "blue";

    //triangle.style.fitler = "progid:DXImageTransform.Microsoft.Matrix(M11="+a+", M12="+b+", M21="+c+", M22="+d+", Dx="+e+", Dy="+f+")";

    /*var w = 512*0.75;
    var h = 512*0.75;
  
    var fill = document.createElement('vml:fill');
    fill.src = 'models/space_frigate_6_color.jpg';
    fill.type = 'tile';
    fill.size = w+'pt, '+h+'pt';
  
    triangle.appendChild(fill);*/
    
    /*var image = document.createElement('vml:imagedata');
    image.src = 'models/space_frigate_6_color.jpg';
    
    triangle.appendChild(image);  */
     
    
  }
/* <<<< Additional functions <<<< */




N3D.Graphics.Render = function(){};
N3D.Graphics.Render.prototype = {
  backfaceCulling: true,
  shaders: null,
  shaderProgram: {},
  remove: function(){
    var c = this.canvas;
    c.parentNode.removeChild(c);
  },
  add: function(o){
    if(o instanceof N3D.Graphics.Shader){
      var gl = this.context;
      var shaderProgram = gl.createProgram();
    
      this.shaders = o;
      N3D.Graphics.Render.shaders.push(o);

      this.shaders.vertex = bindShader(gl,o.vertexSource,gl.VERTEX_SHADER);
      this.shaders.fragment = bindShader(gl,o.fragmentSource,gl.FRAGMENT_SHADER);
   
      gl.attachShader(shaderProgram,this.shaders.vertex);
      gl.attachShader(shaderProgram,this.shaders.fragment);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error('Unable to initialize the shader program.');
      }
  
      gl.useProgram(shaderProgram);
      this.shaderProgram = shaderProgram;
    
      this.shaders.bind(this);
    }
  }
};


//---- Render WebGL ----  
N3D.Graphics.RenderWebGL = function(){};

N3D.Graphics.RenderWebGL.prototype = extend(N3D.Graphics.RenderWebGL,N3D.Graphics.Render);
N3D.Graphics.RenderWebGL.prototype.constructor = N3D.Graphics.Render;

N3D.Graphics.RenderWebGL.prototype.clear = function(){
  var ctx = this.context;
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
};
N3D.Graphics.RenderWebGL.prototype.init = function(){
  if(!N3D.Support.WebGL){ throw new Error('Your browser not supported WebGL'); }
  var canvas = document.createElement('canvas');
  var ctx;
  var names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
  for (var i=0; names.length>i; i++) {
    try { 
      ctx = canvas.getContext(names[i]);
      if (ctx) { break; }
    } catch (e) { }
  }

  if(!ctx) { return false; }
  
  ctx.clearColor(0, 0, 0, 0);
  ctx.clearDepth(1.0);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);
  ctx.clear(ctx.DEPTH_BUFFER_BIT);
  
  this.canvas = canvas;
  this.context = ctx;

  if(N3D.Graphics.Render.shaders.length == 0){
    this.add(new N3D.Graphics.Shader('shaders/vertex.shader','shaders/fragment.shader'));
  }else{
    this.add(N3D.Graphics.Render.shaders.pop());
  } 
   
  return this;
};

N3D.Graphics.RenderWebGL.prototype.setViewport = function(w,h){
  this.context.viewport(0,0,this.canvas.width = w,this.canvas.height = h);
};

N3D.Graphics.RenderWebGL.prototype.toString = function(){
  return 'N3D.Graphics.Render3D';
};


//---- Render Canvas ---- 
N3D.Graphics.RenderCanvas = function(){
  this.shaders = null;
  this.shaderProgram = {};
};
N3D.Graphics.RenderCanvas.prototype = extend(N3D.Graphics.RenderCanvas,N3D.Graphics.Render);
N3D.Graphics.RenderCanvas.prototype.constructor = N3D.Graphics.Render;
N3D.Graphics.RenderCanvas.prototype.clear = function(){
  var viewport = this.canvas;
  this.context.clearRect(0,0,viewport.width,viewport.height); 
};
N3D.Graphics.RenderCanvas.prototype.setViewport = function(w,h){
  this.canvas.width = w;
  this.canvas.height = h;
  this.context.setTransform(1,0,0,-1,0,h);
};

N3D.Graphics.RenderCanvas.prototype.init = function(){
  if(!N3D.Support.Canvas){ throw new Error('Your browser not supported Canvas'); }
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

  
  N3D_G_Triangle.drawTexture = drawTextureCanvas;
  N3D_G_Triangle.draw = drawCanvas;
  return this;
};  
N3D.Graphics.RenderCanvas.prototype.toString = function(){
  return 'N3D.Graphics.RenderCanvas';
}; 


//---- Render SVG ---- 
N3D.Graphics.RenderSVG = function(){
  this.shaders = null;
  this.shaderProgram = {};
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
  
  context.appendChild(this.defs);
  context.appendChild(this.group);

  N3D_G_Triangle.drawTexture = drawTextureSVG;   
  N3D_G_Triangle.draw = drawSVG;  
  return this;
};
N3D.Graphics.RenderSVG.prototype.setViewport = function(w,h){
  this.canvas.width = w;
  this.canvas.height = h; 
  this.canvas.setAttribute("width",w);
  this.canvas.setAttribute("height",h);
  this.group.setAttribute('transform','matrix(1,0,0,-1,0,'+h+')');
};
N3D.Graphics.RenderSVG.prototype.clear = function(){};

//---- Render VML ---- 
N3D.Graphics.RenderVML = function(){
  this.shaders = null;
  this.shaderProgram = {};
};

N3D.Graphics.RenderVML.prototype = extend(N3D.Graphics.RenderVML,N3D.Graphics.Render);

N3D.Graphics.RenderVML.prototype.init = function(){
  if(!N3D.Support.VML){ throw new Error('Your browser not supported VML'); }

  document.createStyleSheet().cssText = 'vml{text-align:left;display:block;position:relative;width:300px;height:150px;}' +
                                        'vml *{behavior:url(#default#VML); display: block; position:absolute;z-index:-1;}';
  document.namespaces.add('vml', 'urn:schemas-microsoft-com:vml');
  
  
  var context = document.createElement('vml');
  
  var group = document.createElement('vml:group');
  group.coordorigin = '0 0';
  group.coordsize = '100 100';
  group.style.width = '100';
  group.style.height = '100';
  
  
  this.group = group; 
  
  this.context = context;
  this.canvas = context;

  context.appendChild(this.group);
  
 
  var shape = document.createElement('vml:shape');
  shape.strokecolor = "red";
  shape.coordorigin = "0 0";
  shape.coordsize = "100 100";
  shape.style.width = 100;
  shape.style.height = 100;
  //shape.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=0.5, M12=0.6, M21=-0.7, M22=0.8, Dy=65)";
  shape.path = "m 123,114 l 329,284 123,284 x e";
  
  /*
  123,114
  329,284
  123,284  
  */
  
  

  
  shape.innerHTML = '<v:fill type="frame" origin="0, 0" position="0,0" src="models/mapping.png" />';
  
  
  context.appendChild(shape);

  N3D_G_Triangle.drawTexture = drawTextureVML;   
  N3D_G_Triangle.draw = drawVML;
  return this;
};
N3D.Graphics.RenderVML.prototype.setViewport = function(w,h){
  var canvas = this.canvas;   
  
  canvas.style.width = w+'px';
  canvas.style.height = h+'px';
  //canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=0, M21=0, M22=-1, Dx=0, Dy="+h+")";
};
N3D.Graphics.RenderVML.prototype.clear = function(){};

})();


N3D.Graphics.Render.shaders = [];
/* <<<< Graphics.Render <<<< */




/* >>>> Graphics.Scene >>>> */
N3D.Graphics.Scene = function(){
  this.models = [];
  this.polygons = [];
  this.lights = [];
};

N3D.Graphics.Scene.prototype.constructor = N3D.Graphics.Scene2D;
N3D.Graphics.Scene.prototype.update = function(){
  var models = this.models, 
      mlength = models.length;
      
  for(var i=0;i<mlength;i++){
    models[i].updateTransform().update().drawToContext();
  }
};

N3D.Graphics.SceneWebGL = function(){
  this.models = [];
  this.polygons = [];
  this.lights = [];
};
N3D.Graphics.SceneWebGL.prototype = extend(N3D.Graphics.SceneWebGL,N3D.Graphics.Scene);
N3D.Graphics.SceneWebGL.prototype.update = function(){
  var shapes = this.models;
  var length = shapes.length;
  if(length == 0){ return false; }
  
  var camera = this.parent.camera;
  var render = this.parent.render;
  var shaders = render.shaders; 
  var gl = render.context;   
  
  var shape;
  
  gl.uniformMatrix4fv(shaders["pvMatrix"], false, new Float32Array(camera.projectionViewMatrix.elements));

  for(var i=0;i<length;i++){
    shape = shapes[i];
    shape.updateTransform();

    gl.uniformMatrix4fv(shaders["modelMatrix"], false, new Float32Array(shape.matrix.elements));

    gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer_position);
    gl.vertexAttribPointer(shaders["aVertexPosition"], 3, gl.FLOAT, false, 0, 0);
      
    if(shape.buffer_texture){
      
      if(shape.specular_texture){      
        gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer_texture);
        gl.vertexAttribPointer(shaders["aTextureCoord"], 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);  
        gl.bindTexture(gl.TEXTURE_2D, shape.buffer_specular_texture); 
      } 
      gl.uniform1i(render.shaders.uSampler, 0);
    }else{
 
      //gl.uniform4f(shaders.vColor, 1,0,0,1);

    }   
    
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.buffer_indices);
    gl.drawElements(shape.gl_draw_type, shape.indices_length, gl.UNSIGNED_SHORT, 0);
  }
};
/* <<<< Graphics.Scene <<<< */



/* >>>> Graphics.Shader >>>> */
(function(){
function parsing(that,shaderName,url){
  var data = new N3D.Utils.Ajax({
    url:url,
    async:false
  }).text;
  
  
  var regex = /^(varying|uniform|attribute|precision)\s+(.*?)\s+(.*?);?$/gm; 
  var store = {};
  while((result = regex.exec(data)) !== null){
    var prop = result[1];
    var type = result[2];
    var name = result[3];
    
    if(typeof store[prop] == 'undefined'){
      store[prop] = [];  
    }

    store[prop].push([name,type]);
  }
  
  
  that[shaderName+'Source'] = data;
  
  return store;
};

N3D.Graphics.Shader = function(vs_url,fs_url){
  this.vertexStore = parsing(this,'vertex',vs_url);
  this.fragmentStore = parsing(this,'fragment',fs_url);
  
  return this;  
};
N3D.Graphics.Shader.prototype = {
  bind:function(render){
    var that = this, gl = render.context, sP = render.shaderProgram, name = '';

    function setUniform(name){
      return gl.getUniformLocation(sP, name);
    };

    function setAttribute(name){
      var attr = gl.getAttribLocation(sP, name);                                          
      gl.enableVertexAttribArray(attr);
      return attr;
    };
    
    function loader(arr,func){
      if(typeof arr == 'undefined'){ return false;}
      var length = arr.length;
      for(var i=0;i<length;i++){
        name = arr[i][0];
        that[name] = func(name);
      }  
    };

    loader(this.vertexStore.uniform,setUniform);
    loader(this.fragmentStore.uniform,setUniform);
    
    loader(this.vertexStore.attribute,setAttribute);
    loader(this.fragmentStore.attribute,setAttribute);

  }
};

})();
/* <<<< Graphics.Shader <<<< */


N3D_Gr_Shader = N3D.Graphics.Shader; 
N3D_Gr_Scene = N3D.Graphics.Scene;
N3D_Gr_SceneWebGL = N3D.Graphics.SceneWebGL;
N3D_Gr_RenderCanvas = N3D.Graphics.RenderCanvas;
N3D_Gr_RenderWebGL = N3D.Graphics.RenderWebGL;
N3D_Gr_RenderSVG = N3D.Graphics.RenderSVG;
N3D_Gr_RenderVML = N3D.Graphics.RenderVML;