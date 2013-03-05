N3D.Math.Vector4 = function(x,y,z,w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
   
  return this;
};
N3D.Math.Vector4.prototype = {
  constructor:N3D.Math.Vector4,
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
  divideVector:function(v){
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    
    return this;
  },
  divideNumber:function(n){
    this.x /= n;
    this.y /= n;
    this.z /= n;
    this.w /= n;
    
    return this;
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w);
  },
  normalize:function(){
    return Math.sqrt(this.dot(this));
  },
  projection:function(width,height){
    var width = width || Game.viewport.width;
    var height = height || Game.viewport.height;
  },
  toString:function(){
    return "N3D.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";
  }
};

N3D.Math.Vector4.Equals = function(v){
  return v instanceof this;
};
N3D.Math.Vector4.Projection = function(obj,viewport){
  var viewport = viewport || Game.viewport;
  obj.divideNumber(obj.w);
  //if(-1 <= obj.x <= 1 && -1 <= obj.y <= 1 && -1 <= obj.z <= 1){
    var x = (obj.x+1)*(viewport.width*0.5); 
    var y = (obj.y+1)*(viewport.height*0.5);
    return new Vector2(x ^ 0,y ^ 0);
  //}
  
  return false;
};

$V4 = N3D.Math.Vector4;