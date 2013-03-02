N3D.Object3D = function(){};
N3D.Object3D.prototype = {
  init:function(){
    this.createVertices();
    this.constructFaces();
    this.applyTransformation();
  },
  applyMVP:function(m){
    var matrix = m.ProjectionMatrix.multiply(m.ViewMatrix);
    matrix.multiply(this.ModelMatrix);

    var vp = this.store.verticesPosition;
    var vp_length  = vp.length;
    this.verticesPosition = [];
    
    for(var i=0;i<vp_length;i++){
      var v = matrix.multiplyVector4(vp[i]);
      v.divideNumber(v.w);
      this.verticesPosition[i] = v;
    }
  },
  applyTransformation:function(){
    if(!this.Transformation){
      return false;
    }
    this.ModelMatrix = new $M4();
    var t = this.Transformation; 
    
    if(typeof t.translate !== "undefined"){
      var o = t.translate;
      this.ModelMatrix.multiply(N3D.Matrix4.CreateTranslation(o.x,o.y,o.z));
    } 
    if(t.rotateZ){
      this.ModelMatrix.multiply(N3D.Matrix4.CreateRotationZ(t.rotateZ * Math.PI/180));
    }
    if(t.rotateY){
      this.ModelMatrix.multiply(N3D.Matrix4.CreateRotationY(t.rotateY * Math.PI/180));
    }
    if(t.rotateX){
      this.ModelMatrix.multiply(N3D.Matrix4.CreateRotationX(t.rotateX * Math.PI/180));
    }
    if(t.scale){
      var o = t.scale;
      this.ModelMatrix.multiply(N3D.Matrix4.CreateScale(o.x,o.y,o.z));
    }    
  },
  createVertices: function(){
    var vp = this.store.verticesPosition;
    var vn = this.store.verticesNormal;
    var vt = this.store.verticesTexture;
    var vpLength = vp.length;
    var vnLength = vn.length;
    var vtLength = vt.length;    

    var vp_new = [];
    for(var i=0;i<vpLength;i+=3){
      vp_new.push(new $V4(
        vp[i],
        vp[i+1],
        vp[i+2],
        1
      ));
    }
    this.store.verticesPosition = vp_new;
    
    var vt_new = [];
    for(var i=0;i<vtLength;i+=2){
      vt_new.push(new $V2(
        vp[i],
        vp[i+1]
      ));
    }
    this.store.verticesTexture = vt_new;
    
    
    var vn_new = [];
    for(var i=0;i<vnLength;i+=3){
      vn_new.push(new $V4(
        vn[i],
        vn[i+1],
        vn[i+2],
        0
      ));
    }
    this.store.verticesNormal = vn_new;
  },
  constructFaces: function(){
    var that = this;
    var i=0, f = this.faces, length = f.length;
    this.triangles = [];
    
    
    function step(n){
      if(n==0){
        return 3;
      }else if(n==1){
        return 4;
      }else if(n==2){
        return 6;
      }else if(n==3){
        return 8;
      }else if(n==4){
        return 9;
      }else if(n==5){
        return 12;
      }
    };
    
    function triangleSet(len,i){
      var quad = (len%4==0 ? true : false);
      var step = (quad == true ? 4 : 3);
      var type = len/step;
      
      var polygon, step, n = i;
      var v0,v1,v2,v3;
      
      v0 = f[n]-1;
      v1 = f[n+1]-1;
      v2 = f[n+2]-1;
      
      if(quad == true){
        v3 = f[n+3]-1;
        
        polygon = new N3D.Quadrangle;
        polygon.setPositionVertices(v0,v1,v2,v3);
        
        if(len>=2){
           //Až bude potřeba, tak dodělat
        }        
      }else{
        polygon = new N3D.Triangle;
        polygon.setPositionVertices(v0,v1,v2);
        n+=step;
        
        if(len>=2){
          v0 = that.store.verticesTexture[f[n]-1];
          v1 = that.store.verticesTexture[f[n+1]-1];
          v2 = that.store.verticesTexture[f[n+2]-1];
          polygon.setTextureVertices(v0,v1,v2);
          n+=step;
          
          if(len==3){
            v0 = f[n]-1;
            v1 = f[n+1]-1;
            v2 = f[n+2]-1;
            polygon.setNormalVertices(v0,v1,v2);  
          }
          //console.log(v0,v1,v2);
        }
      }
      polygon.parent = that;      
      return polygon; 
    };
    
    var n = 0;
        
    while(i<length){
      var count = step(f[i]);
      this.triangles.push(triangleSet(count,i+1));
      i+=count+1;
    }

  }
};

N3D.Object3D.FromOBJ = function(url,callback){
  var that = this;
  var ajaxCall = $ajax(url,null,{
    dataStructure:"json"
  }).complete(function(data){
    that.store = {};
    that.store.verticesPosition = data.verticesPosition;
    that.store.verticesNormal = data.verticesNormal;
    that.store.verticesTexture = data.verticesTexture;
    that.faces = data.faces;
    that.init();
    callback();
  });
};
N3D.Object3D.FromOBJ.prototype = N3D.Object3D.prototype;

N3D.Triangle = function(){};
N3D.Triangle.prototype = {
  setPositionVertices: function(v0,v1,v2){
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
  },
  setTextureVertices: function(v0,v1,v2){
    this.vt0 = v0;
    this.vt1 = v1;
    this.vt2 = v2;
  },
  setNormalVertices: function(v0,v1,v2){
    this.vn0 = v0;
    this.vn1 = v1;
    this.vn2 = v2;
  },
  toString:function(){
    return "N3D.Triangle";
  },
  draw:function(ctx){
    var vp = this.parent.verticesPosition;
    var v0 = vp[this.v0];
    var v1 = vp[this.v1];
    var v2 = vp[this.v2];
    //ctx.moveTo()
    var x0 = v0.x, x1 = v1.x, x2 = v2.x;
    var y0 = v0.y, y1 = v1.y, y2 = v2.y;

    //var u0 = this.ua.x, u1 = this.ub.x, u2 = this.uc.x;
    //var v0 = this.ua.y, v1 = this.ub.y, v2 = this.uc.y;

    //ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);


    ctx.closePath();
    ctx.stroke();
    ctx.fill();


    //ctx.clip();

    /*x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
    u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
    
    var id = 1.0 / (u1*v2 - u2*v1);
    var a = id * (v2*x1 - v1*x2);
    var b = id * (v2*y1 - v1*y2);
    var c = id * (u1*x2 - u2*x1);
    var d = id * (u1*y2 - u2*y1);
    var e = x0 - a*u0 - c*v0;
    var f = y0 - b*u0 - d*v0; */

    //ctx.transform( a, b, c, d, e, f );
    //ctx.drawImage(this.parent.material.get(), 0, 0);
    
    //ctx.restore(); 
  },
  zDepth:function(){
    var vp = this.parent.verticesPosition;
    return Math.min(vp[this.v0].z,vp[this.v1].z,vp[this.v2].z);
  }   
};


N3D.Quadrangle = function(){};
N3D.Quadrangle.prototype = {
  setVertices: function(v0,v1,v2,v3){
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  },
  setTextureVertices: function(v0,v1,v2,v3){
    this.vt0 = v0;
    this.vt1 = v1;
    this.vt2 = v2;
    this.vt3 = v3;
  },
  setNormalVertices: function(v0,v1,v2,v3){
    this.vn0 = v0;
    this.vn1 = v1;
    this.vn2 = v2;
    this.vn3 = v3;
  },
  toString:function(){
    return "N3D.Quadrangle";
  }
};