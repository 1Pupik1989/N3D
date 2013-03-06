N3D.Math.Vector3_test = function(x,y,z){
  this.m = [x,y,z];
   
  return this;
};
N3D.Math.Vector3_test.prototype = {
  add:function(v){
    this.m[0] += v.m[0];
    this.m[1] += v.m[1];
    this.m[2] += v.m[2];
    this.m[3] += v.m[3];
    
    return this;
  },
  toString:function(){
    return "N3D.Vector4("+this.m[0]+","+this.m[1]+","+this.m[2]+")";
  }
};

$V3t = N3D.Math.Vector3_test;
