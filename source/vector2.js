N3D.Math.Vector2 = function(x,y){
  this.x = x;
  this.y = y;

  return this;
};
N3D.Math.Vector2.prototype = {
  constructor:N3D.Math.Vector2,
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x;
    this.y -= v.y;
    
    return this;  
  },
  multiply:function(){
    this.x *= v.x;
    this.y *= v.y;
    
    return this;  
  },
  divide:function(){
    this.x /= v.x;
    this.y /= v.y;
    
    return this;  
  },
  multiplyNumber:function(n){
    this.x *= n;
    this.y *= n;
    
    return this;
  },
  toString:function(){
    return "N3D.Vector2("+this.x+","+this.y+")";
  },
  negative:function(){
    return this.scale(-1);
  }  
};

N3D.Math.Vector2.Equals = function(v){
  return v instanceof this;
};

$V2 = N3D.Math.Vector2;
