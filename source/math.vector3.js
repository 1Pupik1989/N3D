N3D.isLoaded = true;

var $V3 = N3D.Math.Vector3 = function(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
  
  return this;
};
N3D.Math.Vector3.prototype = {
  constructor:N3D.Math.Vector3,
  clone:function(){
    return new $V3(this.x,this.y,this.z);
  },
  xyz:function(){
    return [this.x,this.y,this.z];
  },
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    
    return this;
  },
  scale:function(v){
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    
    return this;
  },
  multiplyNumber:function(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
    
    return this;
  },
  cross:function(v){
    var x = this.x,y = this.y,z = this.z;
    
    this.x = y*v.z - z*v.y;
    this.y = z*v.x - x*v.z;
    this.z = x*v.y - y*v.x;
    
    return this;
  },
  dot:function(){
    var x = this.x,y = this.y,z = this.z;
    return (x*x + y*y + z*z);
  },
  length:function(){
    var x = this.x,y = this.y,z = this.z;
    return Math.sqrt(x*x + y*y + z*z);
  },
  normalize:function(){
    var x = this.x,y = this.y,z = this.z;
    var length = Math.sqrt(x*x + y*y + z*z);
    
    this.x /= length;
    this.y /= length;
    this.z /= length;
    
    return this; 
  },
  negative:function(){
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  },
  rotateY:function(angle){
    var x = this.x, z = this.z;
    
    var c = Math.cos(angle),
        s = Math.sin(angle);
    
    this.x = z*s + x*c;
    this.z = z*c - x*s;    
    
    return this;
  },
  rounded:function(){
    this.x = ~~this.x;
    this.y = ~~this.y;
    this.z = ~~this.z;
    
    return this;
  },
  toVector4:function(n){
    return new N3D.Math.Vector4(this.x,this.y,this.z,n);
  },
  toString:function(){
    return "N3D.Vector3("+this.x+","+this.y+","+this.z+")";
  }
};
N3D.Math.Vector3.Identity = function(){
  return new this(0,0,0);
};
N3D.Math.Vector3.Up = new N3D.Math.Vector3(0,1,0);
N3D.Math.Vector3.Right = new N3D.Math.Vector3(1,0,0);
N3D.Math.Vector3.Forward = new N3D.Math.Vector3(0,0,-1);

N3D.Math.Vector3.Lerp = function(v1,v2,a){
  return new this(
    $Math.Lerp(v1.x, v2.x, a),
    $Math.Lerp(v1.y, v2.y, a),
    $Math.Lerp(v1.z, v2.z, a)
  );
};
N3D.Math.Vector3.Max = function(v1,v2){
  return new this(
    $Math.Max(v1.x, v2.x),
    $Math.Max(v1.y, v2.y),
    $Math.Max(v1.z, v2.z)
  );
};
N3D.Math.Vector3.Min = function(v1,v2){
  return new this(
    $Math.Min(v1.x, v2.x),
    $Math.Min(v1.y, v2.y),
    $Math.Min(v1.z, v2.z)
  );
};
N3D.Math.Vector3.Herminte = function(v1,t1,v2,t2,a){
  return new this(
    $Math.Hermite(v1.x, t1.x, v2.x, t2.x, a),
    $Math.Hermite(v1.y, t1.y, v2.y, t2.y, a),
    $Math.Hermite(v1.z, t1.z, v2.z, t2.z, a)
  );   
};
N3D.Math.Vector3.isZero = function(v){
  if(v.x==v.y==v.z==0){
    return true;
  }
  return false;
};
N3D.Math.Vector3.Equals = function(v){
  return v instanceof this;
};
N3D.Math.Vector3.DistanceSquared = function(v1,v2){
  return (v1.x-v2.x) * (v1.x-v2.x) + (v1.y-v2.y) * (v1.y-v2.y) + (v1.z-v2.z) * (v1.z-v2.z); 
};
N3D.Math.Vector3.Distance = function(v1,v2){
  return Math.sqrt((v1.x-v2.x) * (v1.x-v2.x) + (v1.y-v2.y) * (v1.y-v2.y) + (v1.z-v2.z) * (v1.z-v2.z));
};
N3D.Math.Vector3.Cross = function(v1, v2){
  return new this(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x  
  );
};
N3D.Math.Vector3.BaryCentric = function(v1,v2,v3,a1,a2,r){
  return new this(
    $Math.Barycentric(v1.x, v2.x, v3.x, a1, a2),
    $Math.Barycentric(v1.y, v2.y, v3.y, a1, a2),
    $Math.Barycentric(v1.z, v2.z, v3.z, a1, a2)
  );
};

N3D.Math.Vector3.CatmullRom = function(v1,v2,v3,v4,a,r){
  return new this(
    $Math.CatmullRom(v1.x, v2.x, v3.x, v4.x, a),
    $Math.CatmullRom(v1.y, v2.y, v3.y, v4.y, a),
    $Math.CatmullRom(v1.z, v2.z, v3.z, v4.z, a)
  );
};

N3D.Math.Vector3.Clamp = function(v1, min, max){
  return new this(
    $Math.Clamp(v1.x, min.x, max.x),
    $Math.Clamp(v1.y, min.y, max.y),
    $Math.Clamp(v1.z, min.z, max.z)
  );
};
N3D.Math.Vector3.Dot = function(v1, v2){
  return (v1.x*v2.x + v1.y*v2.y + v1.z * v2.z);
};
N3D.Math.Vector3.Reflect = function(v,n){
  var dT = 2 * this.Dot(v,n);
  return new N3D.Vector3(
    v.x - dT * n.x,
    v.y - dT * n.y,
    v.z - dT * n.z
  );
};
N3D.Math.Vector3.Add = function(v0,v1){
  return new this(
    v0.x+v1.x,
    v0.y+v1.y,
    v0.z+v1.z  
  );
};

N3D.Math.Vector3.Sub = function(v0,v1){
  return new this(
    v0.x-v1.x,
    v0.y-v1.y,
    v0.z-v1.z  
  );
};
N3D.Math.Vector3.MultiplyScalar = function(v0,n){
  return new this(
    v0.x*n,
    v0.y*n,
    v0.z*n  
  );
};

N3D.Math.Vector3.SmoothStep = function(v1,v2,a){
  return new this(
    $Math.SmoothStep(v1.x, v2.x, a),
    $Math.SmoothStep(v1.y, v2.y, a),
    $Math.SmoothStep(v1.z, v2.z, a)
  );
};