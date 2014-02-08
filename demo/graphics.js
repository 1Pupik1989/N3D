N3D.Graphics = {};


/* >>>> FPS Camera >>>> */
N3D.Graphics.Camera = function(){};
N3D.Graphics.Camera.prototype = {
  constructor:N3D.Graphics.Camera,
  fov:45,
  near:1,
  far:1000,
  updateStatus:false,
  update:function(update){
    if(update || this.updateStatus){

      this.projectionViewMatrix = N3D_M_Matrix4.CreateLookAt(this.position,this.target,N3D_M_Vector3.Up).multiply(
        N3D_M_Matrix4.CreatePerspective(this.fov,N3D.viewportAspectRatio,this.near,this.far)  
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
  
  this.target = this.position.clone().sub(this.direction);
  
  return this;
}; 
N3D.Graphics.FPSCamera.prototype = extend(N3D.Graphics.FPSCamera,N3D.Graphics.Camera);
/* <<<< FPS Camera <<<< */


/* >>>> Canvas render >>>> */
N3D.Graphics.RenderCanvas = function(){
  if(!N3D.Support.Canvas){ throw new Error('Your browser not supported Canvas'); }
  var ctx,bufferCtx;
   
  var canvas = document.createElement('canvas');
  
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  
  this.pre_canvas = document.createElement('canvas');
  this.pre_context = this.pre_canvas.getContext('2d');

  return this;
};


N3D.Graphics.RenderCanvas.prototype.constructor = N3D.Graphics.Render;
N3D.Graphics.RenderCanvas.prototype.clear = function(){
  this.context.clearRect(0,0,N3D.viewportWidth,N3D.viewportHeight);
  this.pre_context.clearRect(-1,-1,2,2);
};
N3D.Graphics.RenderCanvas.prototype.setViewport = function(w,h){
  this.canvas.width = this.pre_canvas.width = w;
  this.canvas.height = this.pre_canvas.height = h;

  w *= 0.5;
  h *= 0.5;
  
  this.pre_context.setTransform(w,0,0,-h,w,h);
  this.pre_context.lineWidth = 1/Math.max(w,h);
};


N3D.Graphics.RenderCanvas.prototype.drawTriangles = function(triangles,model){
  var texture = model.texture;
  var ctx = this.pre_context;
  var t;
  
  var i=0, length = triangles.length;
  var t_w = N3D.viewportWidth;
  var t_h = N3D.viewportHeight; 
  var w = N3D.viewportWidth*0.5;
  var h = N3D.viewportHeight*0.5;

  if(texture){
    var vp0, vp1, vp2;
    var vt0, vt1, vt2;
    var x0,x1,x2,y0,y1,y2;
    var u0,u1,u2,v0,v1,v2;
    var id,a,b,c,d,tx,ty;
    
    ctx.fillStyle = model.texture_pattern;

    for(;i<length;i++){
      t = triangles[i];
      vp0 = t.vp0; vp1 = t.vp1; vp2 = t.vp2;
      vt0 = t.vt0; vt1 = t.vt1; vt2 = t.vt2;
    
      x0 = vp0.x; x1 = vp1.x; x2 = vp2.x;
      y0 = vp0.y; y1 = vp1.y; y2 = vp2.y;

      u0 = vt0.x; u1 = vt1.x; u2 = vt2.x;
      v0 = vt0.y; v1 = vt1.y; v2 = vt2.y;

      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.closePath();
      
      
      x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
      u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
    
      id = 1 / (u1*v2 - u2*v1);
      
      a = id * (v2*x1 - v1*x2);
      b = id * (v2*y1 - v1*y2);
      c = id * (u1*x2 - u2*x1);
      d = id * (u1*y2 - u2*y1);
      tx = (x0 - a*u0 - c*v0);
      ty = (y0 - b*u0 - d*v0);
   
      ctx.save();
      ctx.transform(a, b, c, d, tx,ty);
      ctx.fill();      
      ctx.restore();
    } 
  }else{
    ctx.fillStyle = 'white';
    ctx.beginPath();
    
    
    for(;i<length;i++){
      t = triangles[i];
      vp0 = t.vp0, vp1 = t.vp1, vp2 = t.vp2;
    
      ctx.moveTo(vp0.x,vp0.y);
      ctx.lineTo(vp1.x,vp1.y);
      ctx.lineTo(vp2.x,vp2.y);    
    }   
  
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  this.context.drawImage(this.pre_canvas,0,0,N3D.viewportWidth,N3D.viewportHeight);  
};
/* <<<< Canvas render <<<< */


/* >>>> Scene >>>> */
N3D.Graphics.SceneCanvas = function(){
  this.n3d_triangles = [];
  this.n3d_vertices = [];
  this.models = [];
};

N3D.Graphics.SceneCanvas.prototype.add = function(o){
  var that = this;
  if(o instanceof N3D.Geometry.Shape){
    
    o.load(function(){
      o.init();
      that.models.push(o);
    });
    
  } 
};

N3D.Graphics.SceneCanvas.prototype.update = function(render,camera){
  var camera_matrix = camera.projectionViewMatrix;
  var model,models = this.models;
  var length=models.length;
  
  if(length == 0){
    return;
  }
  
  
  var i,length;
  var j,v_length;
  
  var MVP;
  var tris;
  var index,new_tris;
  var backface, backface_culling = true;
  
  var math_min = Math.min;

  var ctx = render.context;
  
  for(i=0;i<length;i++){
    model = models[i];
    MVP = N3D_M_Matrix4.Multiply(model.matrix,camera_matrix);
    
    v = model.n3d_vertices;
    _v = model._n3d_vertices; 
    v_length = v.length;

    for(j=0;j<v_length;j++){
      vp = v[j];
      vp.copyFromVector(_v[j]).multiplyMatrix4(MVP).scale(1/vp.w);
    }

    v = model.n3d_triangles;
    v_length = v.length; 
    
    new_tris = [];
    index = 0;

    
    for(j=0;j<v_length;j++){
      tris = v[j];
      vp0 = tris.vp0;
      vp1 = tris.vp1;
      vp2 = tris.vp2;
      
      backface = ((vp1.x-vp0.x) * (vp2.y-vp0.y) - (vp1.y-vp0.y) * (vp2.x-vp0.x) > 0)
      if(!backface){ continue; }

      tris.depthInt = math_min(vp0.z,vp1.z,vp2.z);
      
      new_tris[index++] = tris;
    }
    
    v = new_tris.sort(function(a,b){
      return b.depthInt - a.depthInt;
    });
    
    N3D.count_triangles = index;
    
    render.drawTriangles(v,model);    
  }
};
/* <<<< Scene <<<< */