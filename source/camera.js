function Camera(){};
Camera.prototype = {
  fieldOfView:45,
  nearPlane:1,
  farPlane:1000,
  viewMatrix:new $M4(),
  position:new $V3(0,0,50),
  target:new $V3(0,0,0),
  setParameters:function(fov,near,far){
    if(fov){
      this.fieldOfView = fov;
    }
    if(near){
      this.nearPlane = near;
    }
    if(far){
      this.farPlane = far;
    }

  },
  update:function(){
    this.ProjectionMatrix = $M4.CreatePerspectiveProjection(this.fieldOfView,N3D.Game.viewport.aspectRatio,this.nearPlane,this.farPlane);
    this.ViewMatrix = $M4.CreateLookAt(this.position,this.target,$V3.Up);
  }
};

N3D.FPSCamera = function(fov,near,far){
  this.setParameters(fov,near,far);
}; 
N3D.FPSCamera.prototype = Camera.prototype;
N3D.FPSCamera.prototype.toString = function(){
  var str = "N3D.FPSCamera(\n";
  str += "  Field of view: "+this.fieldOfView+",\n";
  str += "  Aspect ratio: "+Game.viewport.aspectRatio.toFixed(4)+",\n";
  str += "  Near clip plane: "+this.nearPlane+",\n";
  str += "  Far clip plane: "+this.farPlane+"\n";
  str += ");";
  return str;
};