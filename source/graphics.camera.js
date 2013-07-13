N3D.Graphics.Camera = function(){
  this.position = new N3D.Math.Vector3(0,0,10);
  this.target = new N3D.Math.Vector3(0,0,0);
  this.viewMatrix = new N3D.Math.Matrix4();
};
N3D.Graphics.Camera.prototype = {
  constructor:N3D.Graphics.Camera,
  fieldOfView:45,
  nearPlane:1,
  farPlane:100,
  updateStatus:false,
  update:function(update){
    if(update || this.updateStatus){
      var projectionMatrix = this.projectionMatrix = $M4.CreatePerspective(this.fieldOfView,this.parent.viewport.aspectRatio,this.nearPlane,this.farPlane);
      var viewMatrix = this.viewMatrix = $M4.CreateLookAt(this.position,this.target,$V3.Up);
      this.projectionViewMatrix = $M4.Multiply(viewMatrix,projectionMatrix);

      this.updateStatus = false;
    }
  }
};

N3D.Graphics.FPSCamera = function(fov,near,far){
  N3D.Graphics.Camera.call(this);
  this.fieldOfView = fov || 45;
  this.nearPlane = near || 1;
  this.farPlane = far || 100;
}; 
N3D.Graphics.FPSCamera.prototype = N3D.Graphics.Camera.prototype;
N3D.Graphics.FPSCamera.prototype.toString = function(){
  var str = "N3D.FPSCamera(\n";
  str += "  Field of view: "+this.fieldOfView+",\n";
  str += "  Aspect ratio: "+this.parent.viewport.aspectRatio.toFixed(4)+",\n";
  str += "  Near clip plane: "+this.nearPlane+",\n";
  str += "  Far clip plane: "+this.farPlane+"\n";
  str += ");";
  return str;
};

$FPSCamera = N3D.Graphics.FPSCamera;