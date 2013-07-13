(function(){
  function add(vec){
    this.x += vec.x; 
    this.y += vec.y; 
    this.z += vec.z; 
    this.w += vec.w;
    
    return this;  
  };
  function sub(vec){
    this.x -= vec.x; 
    this.y -= vec.y; 
    this.z -= vec.z; 
    this.w -= vec.w;
    
    return this;  
  };
  
  function clone(){
    return N3D.Math.Vector4(this.x,this.y,this.z,this.w);
  };
  function xyz(){
    return [this.x,this.y,this.z];
  };
  function xyzw(){
    return [this.x,this.y,this.z,this.w];
  };

  function multiply(v){
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    this.w *= v.w;
    
    return this;
  };
  function multiplyScalar(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
    this.w *= n;
    
    return this;
  };
  function divide(v){
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    
    return this;
  };
  function divideScalar(n){
    return this.multiplyScalar(1/n);
  };
  function dot(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w);
  };
  function normalize(){
    var x = this.x, y = this.y, z = this.z, w = this.w;
    var f = 1/Math.sqrt(x*x+y*y+z*z+w*w);
    this.x *= f;
    this.y *= f;
    this.z *= f;
    this.w *= f;
    
    return this;
  };
  function length(){
    var x = this.x, y = this.y, z = this.z, w = this.w;
    return Math.sqrt(x*x+y*y+z*z+w*w);
  };
  function multiplyMatrix4(m){
    var m = m.elements;
    var x = this.x, y = this.y, z = this.z,w = this.w;
    
    this.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    this.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    this.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    this.w = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    
    return this; 
  };
  function copyFromVector4(vec){
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    this.w = vec.w;
    
    return this;
  };
  function toHomogenous(width,height){
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
  };
  function toString(){
    return "N3D.Math.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";
  };

  N3D.Math.Vector4 = function(x,y,z,w){
    return {
      constructor:N3D.Math.Vector4,
      x:x,
      y:y,
      z:z,
      w:w,
      add:add,
      sub:sub,
      clone:clone,
      xyz:xyz,
      xyzw:xyzw,
      multiply:multiply,
      multiplyScalar:multiplyScalar,
      divide:divide,
      divideScalar:divideScalar,
      dot:dot,
      normalize:normalize,
      length:length,
      multiplyMatrix4:multiplyMatrix4,
      copyFromVector4:copyFromVector4,
      toHomogenous:toHomogenous
    }; 
  };

  N3D.Math.Vector4.Multiply = function(vec1,vec2){
    return this(
      vec1.x * vec2.x,
      vec1.y * vec2.y,
      vec1.z * vec2.z,
      vec1.w * vec2.w
    );
  };

  $V4 = N3D.Math.Vector4;
})();
