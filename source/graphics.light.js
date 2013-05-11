N3D.Graphics.Light = function(){
  this.position = new $V4(0,0,10,1);
  
};
N3D.Graphics.Light.prototype = {
  update:function(){
    this.ViewMatrix = $M4.CreateLookAt(this.position,$V3.Zero,$V3.Up);
    this.ProjectionMatrix = this.scene.camera.ProjectionMatrix;
    this.VPMatrix = this.ViewMatrix.multiply(this.ProjectionMatrix);
  }
};

N3D.Graphics.AmbientLight = function(hex){
  this.color = new $Color($Color.HEX,hex);

	return this;
};

N3D.Graphics.AmbientLight.prototype = new N3D.Graphics.Light();

N3D.Graphics.DirectionalLight = function(){

};
N3D.Graphics.DirectionalLight.prototype = new N3D.Graphics.Light();



N3D.Graphics.PointLight = function(){

};
N3D.Graphics.PointLight.prototype = new N3D.Graphics.Light();



N3D.Graphics.SpotLight = function(){

};
N3D.Graphics.SpotLight.prototype = new N3D.Graphics.Light();

$AmbientLight = N3D.Graphics.AmbientLight;
$DirectionalLight = N3D.Graphics.DirectionalLight;
$PointLight = N3D.Graphics.PointLight;
$SpotLight = N3D.Graphics.SpotLight;

//N3D.Graphics.AmbientLight - Ambientní světlo
//N3D.Graphics.DirectionalLight - Směrové světlo
//N3D.Graphics.PointLight - bodové světlo
//N3D.Graphics.SpotLight - reflektorové světlo
