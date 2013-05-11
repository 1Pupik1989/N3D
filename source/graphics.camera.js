N3D.Graphics.Camera = function(){};
N3D.Graphics.Camera.prototype = {
  fieldOfView:45,
  nearPlane:1,
  farPlane:100,
  viewMatrix:new $M4(),
  position:new $V3(0,0,20),
  target:new $V3(0,0,0),
  updateStatus:true,
  update:function(update){
    if(update || this.updateStatus){
      this.ProjectionMatrix = $M4.CreatePerspectiveProjection(this.fieldOfView,this.parent.viewport.aspectRatio,this.nearPlane,this.farPlane);
      this.ViewMatrix = $M4.CreateLookAt(this.position,this.target,$V3.Up);
      this.VPMatrix = this.ViewMatrix.multiply(this.ProjectionMatrix);
      this.updateStatus = false;
    }
  }
};

N3D.Graphics.FPSCamera = function(fov,near,far){
  this.fieldOfView = fov || 45;
  this.nearPlane = near || 1;
  this.farPlane = far || 100;
}; 
N3D.Graphics.FPSCamera.prototype = new N3D.Graphics.Camera();
N3D.Graphics.FPSCamera.prototype.toString = function(){
  var str = "N3D.FPSCamera(\n";
  str += "  Field of view: "+this.fieldOfView+",\n";
  str += "  Aspect ratio: "+$Game.viewport.aspectRatio.toFixed(4)+",\n";
  str += "  Near clip plane: "+this.nearPlane+",\n";
  str += "  Far clip plane: "+this.farPlane+"\n";
  str += ");";
  return str;
};

$FPSCamera = N3D.Graphics.FPSCamera;