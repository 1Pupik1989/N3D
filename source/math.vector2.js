N3D.isLoaded = true;

var $V2 = N3D.Math.Vector2 = function(x,y){
  this.x = x;
  this.y = y;

  return this;
};
N3D.Math.Vector2.prototype = {
  constructor:N3D.Math.Vector2,
  xy:function(){
    return [this.x,this.y];
  },
  clone:function(){
    return new $V2(this.x,this.y);
  },
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
  multiply:function(v){
    this.x *= v.x;
    this.y *= v.y;
    
    return this;  
  },
  multiplyScalar:function(n){
    this.x *= n;
    this.y *= n;
    
    return this;
  },
  normalize:function(){
    var x = this.x,y = this.y;
    var length = Math.sqrt(x*x + y*y);
    
    this.x /= length;
    this.y /= length;
    
    return this; 
  },
  perpendicular:function(){
   var x = this.x,y = this.y;
   var scale_factor = 1 / Math.sqrt(x*x + y*y);
   
   this.x = -1 * y;
   this.y = x;
   
   return this;
  },
  divide:function(v){
    this.x /= v.x;
    this.y /= v.y;
    
    return this;  
  },
  divideScalar:function(n){
    this.x /= n;
    this.y /= n;
    
    return this;
  },
  rotate:function(angle){
    var x = this.x, y = this.y;
    
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    
    this.x = x*cos - y*sin;
    this.y = x*sin + y*cos;
    
    return this;
  },
  toString:function(){
    return "N3D.Vector2("+this.x+","+this.y+")";
  },
  negative:function(){
    return this.scale(-1);
  }  
};
N3D.Math.Vector2.Identity = function(){
  return new this(0,0);
};
N3D.Math.Vector2.Add = function(v1,v2){
  return new this(v2.x+v1.x,v2.y+v1.y);
};
N3D.Math.Vector2.Dot = function(v1, v2){
  return (v1.x*v2.x + v1.y*v2.y);
};
N3D.Math.Vector2.Sub = function(v1,v2){
  return new this(v2.x-v1.x,v2.y-v1.y);
};
N3D.Math.Vector2.Cross = function(v1,v2){
  return new this(
    v1.x*v2.y - v1.y*v2.x
  );
};

$V2 = N3D.Math.Vector2;