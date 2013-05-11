
N3D.Scene3D = function(){};
N3D.Scene3D.prototype = {
  update:function(){
    var shape = this.parent.models[0];
    var camera = this.parent.camera;
    var render = this.parent.render; 
    var gl = render.context;   
      
    gl.uniformMatrix4fv(render.shader["vPMatrix"], false, new Float32Array(camera.VPMatrix.m));
    gl.uniformMatrix4fv(render.shader["modelMatrix"], false, new Float32Array(shape.ModelMatrix.m));   
  
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.cubeVerticesBuffer);
    gl.vertexAttribPointer(render.shader["aVertexPosition"], 3, gl.FLOAT, false, 0, 0);
  
    if(shape.verticesNormal.length !== 0){
      gl.bindBuffer(gl.ARRAY_BUFFER, shape.cubeVertexNormalBuffer);
      gl.vertexAttribPointer(render.shader["aVertexNormal"], 2, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, shape.cubeVerticesTextureCoordBuffer);
    gl.vertexAttribPointer(render.shader["aTextureCoord"], 2, gl.FLOAT, false, 0, 0);    

    gl.activeTexture(gl.TEXTURE0);  
    gl.bindTexture(gl.TEXTURE_2D, shape.material.texture);

    gl.uniform1i(render.shader.uSampler, 0);
    
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.cubeVerticesIndexBuffer);
    gl.drawElements(gl.TRIANGLES, shape.facesLength , gl.UNSIGNED_SHORT, 0);
  }
}


N3D.Scene2D = function(){
  this.models = [];
  this.polygons = [];
  this.lights = [];
 
};
N3D.Scene2D.prototype = {
  update : function(cam){
    var models = this.parent.models, 
        mlength = models.length,
        lights = this.lights,
        llength = lights.length,
        ctx = this.parent.render.context;
 
    for(var i=0;i<mlength;i++){
      models[i].drawTo2DContext();
    }
  }  
};

$Scene2D = N3D.Scene2D;
$Scene3D = N3D.Scene3D;
