N3D.Math.Vector4 = function(x,y,z,w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  
  return this;
};
N3D.Math.Vector4.prototype = {
  constructor:N3D.Math.Vector4,
  clone:function(){
    return new N3D.Math.Vector4(this.x,this.y,this.z,this.w);
  },
  xyz:function(){
    return [this.x,this.y,this.z];
  },
  xyzw:function(){
    return [this.x,this.y,this.z,this.w];
  },
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    
    return this;
  },
  multiply:function(v){
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    this.w *= v.w;
    
    return this;
  },
  multiplyScalar:function(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
    this.w *= n;
    
    return this;
  },
  divide:function(v){
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    
    return this;
  },
  divideScalar:function(n){
    return this.multiplyScalar(1/n);
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w);
  },
  normalize:function(){
    var x = this.x, y = this.y, z = this.z, w = this.w;
    var f = 1/Math.sqrt(x*x+y*y+z*z+w*w);
    this.x *= f;
    this.y *= f;
    this.z *= f;
    this.w *= f;
    
    return this;
  },
  length:function(){
    var x = this.x, y = this.y, z = this.z, w = this.w;
    return Math.sqrt(x*x+y*y+z*z+w*w);
  },
  multiplyMatrix4:function(m){
    var m = m.m;
    var x = this.x, y = this.y, z = this.z,w = this.w;
    
    this.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    this.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    this.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    this.w = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    
    return this; 
  },
  copyFromVector4:function(o){
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    this.w = o.w;
    
    return this;
  },
  projection:function(width,height){
    var invW = 1/this.w;

    var x = this.x*invW,
        y = this.y*invW,
        z = this.z*invW;
  
    if(-1 < x && x < 1 && -1 < y && y < 1 && -1 < z && z < 1){
      this.x = ~~((x+1)*(width*0.5)); 
      this.y = ~~((y+1)*(height*0.5));
      this.z = z;

      this.draw = true;
      
      return this;  
    }
  
    this.draw = false;
    
    return false;
  },
  toString:function(){
    return "N3D.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";
  }
};

N3D.Math.Vector4.Equals = function(v){
  return v instanceof this;
};

N3D.Math.Vector4.Sub = function(v1,v2){
  return new this(
    v1.x-v2.x,
    v1.y-v2.y,
    v1.z-v2.z,
    v1.w-v2.w  
  );
};

N3D.Math.Vector4.Projection = function(p,viewport){
  var viewport = viewport || $Game.viewport;
  p.divideNumber(p.w);
  var w = 1;
  
  if(-w <= p.x <= w && -w <= p.y <= w && -w <= p.z <= w){
    var x = (p.x+1)*(viewport.width*0.5); 
    var y = (p.y+1)*(viewport.height*0.5);
    var v = new $V2(~~x,~~y);
    v.z = p.z;
    return v;  
  }
  
  return false;
};

$V4 = N3D.Math.Vector4;