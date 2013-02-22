function Vector3(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
  
  return this;
};
Vector3.prototype = {
  constructor:Vector3,
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
  toString:function(){
    return "N3D.Vector3("+this.x+","+this.y+","+this.z+")";
  }
};

Vector3.Up = new Vector3(0,1,0);
Vector3.Right = new Vector3(1,0,0);
Vector3.Forward = new Vector3(0,0,1);
Vector3.Zero = new Vector3(0,0,0);

Vector3.Lerp = function(v1,v2,a){
  return new this(
    MathHelper.Lerp(v1.x, v2.x, a),
    MathHelper.Lerp(v1.y, v2.y, a),
    MathHelper.Lerp(v1.z, v2.z, a)
  );
};
Vector3.Max = function(v1,v2){
  return new this(
    MathHelper.Max(v1.x, v2.x),
    MathHelper.Max(v1.y, v2.y),
    MathHelper.Max(v1.z, v2.z)
  );
};
Vector3.Min = function(v1,v2){
  return new this(
    MathHelper.Min(v1.x, v2.x),
    MathHelper.Min(v1.y, v2.y),
    MathHelper.Min(v1.z, v2.z)
  );
};
Vector3.Herminte = function(v1,t1,v2,t2,a){
  return new this(
    MathHelper.Hermite(v1.x, t1.x, v2.x, t2.x, a),
    MathHelper.Hermite(v1.y, t1.y, v2.y, t2.y, a),
    MathHelper.Hermite(v1.z, t1.z, v2.z, t2.z, a)
  );   
};
Vector3.isZero = function(v){
  if(v.x==v.y==v.z==0){
    return true;
  }
  return false;
};
Vector3.Equals = function(v){
  return v instanceof this;
};
Vector3.DistanceSquared = function(v1,v2){
  return (v1.x-v2.x) * (v1.x-v2.x) + (v1.y-v2.y) * (v1.y-v2.y) + (v1.z-v2.z) * (v1.z-v2.z); 
};
Vector3.Distance = function(v1,v2){
  return Math.sqrt(this.DistanceSquared(v1,v2));
};
Vector3.Cross = function(v1, v2){
  return new this(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x  
  );
};
Vector3.BaryCentric = function(v1,v2,v3,a1,a2,r){
  return new this(
    MathHelper.Barycentric(v1.x, v2.x, v3.x, a1, a2),
    MathHelper.Barycentric(v1.y, v2.y, v3.y, a1, a2),
    MathHelper.Barycentric(v1.z, v2.z, v3.z, a1, a2)
  );
};

Vector3.CatmullRom = function(v1,v2,v3,v4,a,r){
  return new this(
    MathHelper.CatmullRom(v1.x, v2.x, v3.x, v4.x, a),
    MathHelper.CatmullRom(v1.y, v2.y, v3.y, v4.y, a),
    MathHelper.CatmullRom(v1.z, v2.z, v3.z, v4.z, a)
  );
};

Vector3.Clamp = function(v1, min, max){
  return new this(
    MathHelper.Clamp(v1.x, min.x, max.x),
    MathHelper.Clamp(v1.y, min.y, max.y),
    MathHelper.Clamp(v1.z, min.z, max.z)
  );
};
Vector3.Dot = function(v1, v2){
  return (v1.x*v2.x + v1.y*v2.y + v1.z * v2.z);
};
Vector3.Reflect = function(v,n){
  var dT = 2 * this.Dot(v,n);
  return new N3D.Vector3(
    v.x - dT * n.x,
    v.y - dT * n.y,
    v.z - dT * n.z
  );
};


Vector3.SmoothStep = function(v1,v2,a){
  return new this(
    MathHelper.SmoothStep(v1.x, v2.x, a),
    MathHelper.SmoothStep(v1.y, v2.y, a),
    MathHelper.SmoothStep(v1.z, v2.z, a)
  );
};

if(typeof N3D !== "undefined"){
  N3D.Vector3 = Vector3;
}