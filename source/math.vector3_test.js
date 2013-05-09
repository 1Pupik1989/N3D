N3D.Math.Vector3_test = function(x,y,z){
 
  return {
    x:x,
    y:y,
    z:z,
    add:function(v){
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    }
  }
};

$V3_test = N3D.Math.Vector3_test;