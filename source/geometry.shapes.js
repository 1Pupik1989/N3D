N3D.Geometry.Object3D = function(data){
  this.data = data;
  
  this.ModelMatrix = new $M4();
  this.transformation = {}; 
  
  var vp = data.v;
  var length = vp.length;
  var befMax = Number.MIN_VALUE;
  var befMin = Number.MAX_VALUE;

  
  for(var i=0;i<length;i++){
    var d = vp[i];
    var x = d[0];
    var y = d[1];
    var z = d[2];
    
    var min = Math.min(x,y,z);
    var max = Math.max(x,y,z);
    if(max>befMax){
      befMax = max;
    }
    if(min<befMin){
      befMin = min;
    }
  }
  
  var size = befMax-befMin;
  
  for(var i=0;i<length;i++){
    vp[i][0] /= size;
    vp[i][1] /= size;
    vp[i][2] /= size;    
  }
  
  
  

  function get(data,type){
    var store = [];
    if(typeof data == "undefined"){
      return store;
    }
    var length = data.length;
    
    
    
    
    for(var i=0;i<length;i++){
      var d = data[i];
      var v = new type(d[0],d[1],d[2],1);
      v.original = new type(d[0],d[1],d[2],1);
      store.push(v);  
    }
    return store;
  };
  
  
  this.verticesPosition = get(data.v,$V4);
  this.verticesNormal = get(data.vn,$V4);
  this.verticesTexture = get(data.vt,$V2);

  return this;
};

N3D.Geometry.Object3D.prototype = {
  constructor:N3D.Geometry.Object3D,
  backface:false,
  addTo2D:function(){
    this.polygons = [];
    
    var vp = this.verticesPosition;
    var vn = this.verticesNormal;
    var vt = this.verticesTexture;
    var f = this.data.f;
    var f_length = f.length;

    var length = vp.length;
    for(var i=0;i<length;i++){
      vp[i].original.y *= -1;
      vp[i].original.z *= -1;
    }
    for(var i=0;i<f_length;i++){
  
      var it = f[i];
      var v0 = it[0].split("/");
      var v1 = it[1].split("/");
      var v2 = it[2].split("/");
    
      var out = new N3D.Geometry.Triangle();

      out.setMaterial(this.material);
      out.setVerticesPosition(  vp[v0[0]-1],vp[v1[0]-1],vp[v2[0]-1]   );
      out.setVerticesNormal(    vn[v0[2]-1],vn[v1[2]-1],vn[v2[2]-1]   );
      out.setVerticesTexture(   vt[v0[1]-1],vt[v1[1]-1],vt[v2[1]-1]   );
      
      out.parent = this;
      
      this.polygons.push(out);
    }

   
  },
  constructForWebGL:function(){
    var polygons = this.polygons;
    var length = polygons.length;
    
    var vertP = [];
    var vertN = [];
    var vertT = [];
    var vertF = [];
    var n = 0;
    
    for(var i=0;i<length;i++){
      var poly = polygons[i];
      vertP = vertP.concat(poly.getVerticesPosition());
      vertT = vertT.concat(poly.getVerticesTexture());
      
      vertN = vertN.concat(poly.getVerticesNormal()); 
      vertF.push(n,n+1,n+2);  
      n+=3;
    }

    var gl = this.parent.render.context;
    var cubeVerticesTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertT), gl.STATIC_DRAW);
  
    var cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertN), gl.STATIC_DRAW); 
  
    var cubeVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertP), gl.STATIC_DRAW);  
  
    var cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertF), gl.STATIC_DRAW);
    
    this.cubeVerticesTextureCoordBuffer = cubeVerticesTextureCoordBuffer;
    this.cubeVertexNormalBuffer = cubeVertexNormalBuffer;
    this.cubeVerticesBuffer = cubeVerticesBuffer;
    this.cubeVerticesIndexBuffer = cubeVerticesIndexBuffer;
    this.verticesPosition = vertP;
    this.verticesNormal = vertN;
    this.verticesTexture = vertT;
    this.faces = vertF;

    this.facesLength = vertF.length;
    this.material.bind(this.parent.render);    
  },
  applyMVP:function(){
    this.applyTransformation();

    var MVP = this.ModelMatrix.multiply(this.parent.camera.VPMatrix),
        vp = this.verticesPosition,
        vp_length = vp.length,
        n;

    var width = this.parent.viewport.width,
        height = this.parent.viewport.height;

    for(var i=0;i<vp_length;i++){
      n = vp[i];
      n.copyFromVector4(n.original).multiplyMatrix4(MVP).projection(width,height);
    }

  },
  applyTransformation:function(){
    var trans = this.transformation;
    if(typeof trans == "undefined"){ return false; }
    var m = this.ModelMatrix = new $M4();    
    var v;

    if(v = trans.scale){
      m.scale(v.x,v.y,v.z);  
    }    
    if(v = trans.rotateX){
      m.rotateX(v);
    }
    if(v = trans.rotateY){
      m.rotateY(v);
    }
    if(v = trans.rotateZ){
      m.rotateZ(v);
    }
    if(v = trans.translate){
      m.translate(v);
    }

    return this;
  },
  drawTo2DContext:function(){
    var polygons = this.polygons;
    var length = polygons.length;
    var newPoly = [];
    var n = 0;
    this.applyMVP();
    
    for(var i=0;i<length;i++){
      poly = polygons[i]; 
      poly.projectSettings();

      if(poly.isVisible == true){
        newPoly[n++] = poly;
        $Game.visibleTriangles++;
      }
    }

    function sort(a,b){
      return (b.depthInt - a.depthInt);
    };
    
    newPoly.sort(sort);


    var length = newPoly.length;
    var render = this.parent.render.context;
    
    for(var i=0;i<length;i++){
      newPoly[i].draw(render);
    }

  }
};

N3D.Geometry.Object3D.LoadFromFiles = function(type,src,options){
  var that = this;
  var ajaxCall = $Ajax(src).complete(function(data){
    var obj = type(data,options);
    that.success(obj);
    return true;
  });
};


var callbacks = {
  success:function(f){ this.success = f; },
  error:function(f){ this.error = f; },
  complete:function(f){ this.complete = f; }
};

N3D.Geometry.Object3D.LoadFromFiles.prototype = callbacks;

N3D.Geometry.Triangle = function(){};
N3D.Geometry.Triangle.prototype = {
  isVisible:true,
  getVerticesPosition:function(){
    return [].concat(this.vp0.xyz(),this.vp1.xyz(),this.vp2.xyz());
  },
  getVerticesNormal:function(){
    if(!this.vn0){
      return [0,0,0,0,0,0,0,0,0];
    }
    return [].concat(this.vn0.xyz(),this.vn1.xyz(),this.vn2.xyz());
  },
  getVerticesTexture:function(){
    var vt0 = this.vt0.original;
    var vt1 = this.vt1.original;
    var vt2 = this.vt2.original;
    
    return [].concat(vt0.xy(),vt1.xy(),vt2.xy());
  },
  setVerticesPosition:function(v0,v1,v2){
    this.vp0 = v0;
    this.vp1 = v1;
    this.vp2 = v2;
  },
  setVerticesNormal:function(v0,v1,v2){
    this.vn0 = v0;
    this.vn1 = v1;
    this.vn2 = v2;
  },
  setVerticesTexture:function(v0,v1,v2){
    var m = this.material;

    this.vt0 = m.getUV(v0);
    
    this.vt1 = m.getUV(v1);
  
    this.vt2 = m.getUV(v2);
  },
  setMaterial:function(m){
    this.material = m;
    if(m instanceof N3D.Graphics.Texture){
      this.draw = this.drawTexture;
    }
  },
  projectSettings:function(){
    var p0 = this.vp0,
        p1 = this.vp1,
        p2 = this.vp2;
    this.isVisible = false;
    if(p0.draw == false || p1.draw == false || p2.draw == false){
      this.isVisible = false;
      return false;
    }

    if(this.parent.backface == false){
      this.isVisible = ((p1.x-p0.x)*(p2.y-p0.y) - (p1.y-p0.y)*(p2.x-p0.x) > 0);
    }else{
      this.isVisible = true;
    }  

    this.depthInt = Math.min(p0.z,p1.z,p2.z);
  },
  draw:function(ctx){
    if(this.isVisible == false){
      return;
    }    
 
    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2;

    ctx.strokeStyle = "white";

    ctx.beginPath();
    ctx.moveTo(vp0.x, vp0.y);
    ctx.lineTo(vp1.x, vp1.y);
    ctx.lineTo(vp2.x, vp2.y);
    ctx.closePath();
    ctx.stroke();

  },
  drawTexture:function(ctx){
    if(this.isVisible == false){
      return;
    }  

    var vp0 = this.vp0,
        vp1 = this.vp1,
        vp2 = this.vp2,
        x0 = vp0.x, x1 = vp1.x, x2 = vp2.x,
        y0 = vp0.y, y1 = vp1.y, y2 = vp2.y;
    var vt0 = this.vt0, vt1 = this.vt1, vt2 = this.vt2,
        u0 = vt0.x, u1 = vt1.x, u2 = vt2.x,
        v0 = vt0.y, v1 = vt1.y, v2 = vt2.y;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();
    
    x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
    u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
    
    var id = 1 / (u1*v2 - u2*v1),
        a = id * (v2*x1 - v1*x2),
        b = id * (v2*y1 - v1*y2),
        c = id * (u1*x2 - u2*x1),
        d = id * (u1*y2 - u2*y1),
        e = x0 - a*u0 - c*v0,
        f = y0 - b*u0 - d*v0;

    ctx.transform( a, b, c, d, e, f );
    ctx.drawImage(this.material.image, 0, 0);
    
    
    ctx.restore();
  }  
};


N3D.Geometry.Cloud = function(){
  
};
N3D.Geometry.Cloud.prototype = {
  generateMaterial:function(){
  
  }  
};



$Triangle = N3D.Geometry.Triangle;
$Quadrangle = N3D.Geometry.Quadrangle;

$Object3D = N3D.Geometry.Object3D;