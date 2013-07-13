N3D.Graphics.Scene = function(){
  this.models = [];
  this.polygons = [];
  this.lights = [];
};
N3D.Graphics.Scene.prototype = {};

N3D.Graphics.Scene3D = function(){
  this.models = [];
  this.polygons = [];
  this.lights = [];
};
N3D.Graphics.Scene3D.prototype = extend(N3D.Graphics.Scene3D,N3D.Graphics.Scene);
N3D.Graphics.Scene3D.prototype.update = function(){
  var shapes = this.models;
  var camera = this.parent.camera;
  var render = this.parent.render; 
  var gl = render.context;   
  var length = shapes.length;
  var shape;
  
  gl.uniformMatrix4fv(render.shaders["pvMatrix"], false, new Float32Array(camera.projectionViewMatrix.elements));

  for(var i=0;i<length;i++){
    shape = shapes[i];
    shape.updateTransform();

    gl.uniformMatrix4fv(render.shaders["modelMatrix"], false, new Float32Array(shape.matrix.elements));
    
    gl.uniformMatrix4fv(render.shaders["normalMatrix"], false, new Float32Array($Math_Matrix4.Multiply(shape.matrix,camera.viewMatrix).inverse().transpose().elements));   
    
    console.log(''+$Math_Matrix4.Multiply(camera.viewMatrix,shape.matrix).inverse());
    
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer_position);
    gl.vertexAttribPointer(render.shaders["aVertexPosition"], 3, gl.FLOAT, false, 0, 0);
  
    if(shape.array_normal.length !== 0){
      gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer_normal);
      gl.vertexAttribPointer(render.shaders["aVertexNormal"], 3, gl.FLOAT, false, 0, 0);
    }

    if(shape.material.textured == true){      
      gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer_texture);
      gl.vertexAttribPointer(render.shaders["aTextureCoord"], 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);  
      gl.bindTexture(gl.TEXTURE_2D, shape.material.specularMap.texture); 
    }else{
      //Dodělat vykreslování, pokud model není texturovaný
      //gl.uniform4f(render.shaders["vColor"], 1, 0, 0, 1);
    }    
    gl.uniform4f(render.shaders["u_color"], 1, 1, 1, 1);
    
    gl.uniform1i(render.shaders.uSampler, 0);

    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.buffer_indices);
    gl.drawElements(gl[shape.gl_draw_type], shape.indices_length, gl.UNSIGNED_SHORT, 0);
  }
};


N3D.Graphics.Scene2D = function(){
  this.models = [];
  this.polygons = [];
  this.lights = [];
};
N3D.Graphics.Scene2D.prototype = extend(N3D.Graphics.Scene2D,N3D.Graphics.Scene);
N3D.Graphics.Scene2D.prototype.constructor = N3D.Graphics.Scene2D;
N3D.Graphics.Scene2D.prototype.update = function(cam){
  var models = this.models, 
      mlength = models.length,
      lights = this.lights,
      llength = lights.length,
      ctx = this.parent.render.context;
      
  for(var i=0;i<mlength;i++){
    models[i].updateTransform().update().drawTo2DContext();
    
  }
};

N3D.Graphics.SceneSVG = function(){
  this.models = [];
  this.polygons = [];
  this.lights = [];
};
N3D.Graphics.SceneSVG.prototype = extend(N3D.Graphics.SceneSVG,N3D.Graphics.Scene);
N3D.Graphics.SceneSVG.prototype.constructor = N3D.Graphics.SceneSVG;
N3D.Graphics.SceneSVG.prototype.update = function(cam){
  var models = this.models, 
      mlength = models.length,
      lights = this.lights,
      llength = lights.length,
      ctx = this.parent.render.context;

  for(var i=0;i<mlength;i++){
    model = models[i]; 
    model.matrix.scale(1,-1,1);
    model.update();
    
    model.drawTo2DContext();
  }
};


$GR_Scene2D = N3D.Graphics.Scene2D;
$GR_Scene3D = N3D.Graphics.Scene3D;
