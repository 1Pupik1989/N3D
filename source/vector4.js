function Vector4(x,y,z,w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
   
  return this;
};
Vector4.prototype = {
  constructor:Vector4,
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w -= v.w;
    
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
  divide:function(v){
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    
    return this;
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w);
  },
  normalize:function(){
    return Math.sqrt(this.dot());
  },
  projection:function(width,height){
    var width = width || Game.viewport.width;
    var height = height || Game.viewport.height;
  },
  toString:function(){
    return "N3D.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";
  }
};
