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
  },
  equals:function(v){
    return (this.x == v.x && this.y == v.y);
  },
  distance:function(v){
    var x = this.x-v.x;
    var y = this.y-v.y;
    return Math.sqrt(x*x + y*y);
  }  
};
N3D.Math.Vector2.Equals = function(){
  return new this(0,0);
};
N3D.Math.Vector2.Identity = function(){
  return new this(0,0);
};
N3D.Math.Vector2.Add = function(v1,v2){
  return new this(v2.x+v1.x,v2.y+v1.y);
};

N3D.Math.Vector2.MultiplyScalar = function(v,n){
  return new this(v.x*n,v.y*n);
};
N3D.Math.Vector2.Dot = function(v1, v2){
  return (v1.x*v2.x + v1.y*v2.y);
};
N3D.Math.Vector2.Sub = function(v1,v2){
  return new this(v2.x-v1.x,v2.y-v1.y);
};
N3D.Math.Vector2.Distance = function(v1,v2){
  var x = v1.x-v2.x, y = v1.y-v2.y;
  return Math.sqrt(x*x+y*y);
};
N3D.Math.Vector2.Cross = function(v1,v2){
  return new this(
    v1.x*v2.y - v1.y*v2.x,
    v2.x*v1.y - v2.y*v1.x
  );
};

N3D.Math.Vector2.Lerp = function(v1,v2,a){
  return new this(
    v1.x + (v2.x-v1.x) * a,
    v1.y + (v2.y-v1.y) * a,
    v1.z + (v2.z-v1.z) * a
  );
};

$V2 = N3D.Math.Vector2;