N3D.Material = {};
N3D.Material.index = 0;
(function(){

function bind(render,callback){
  var that = this;
  if(this.img == null){ 
    return false; 
  }

  function loading(){
    if(render instanceof N3D.Graphics.RenderWebGL){
      var gl = render.context;
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);  
      that.parent.buffer_specular_texture = texture;
    }else if(render instanceof N3D.Graphics.RenderSVG){
      var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
      var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      pattern.appendChild(image);
      render.defs.appendChild(pattern);
      pattern.image = image;
      
      pattern.setAttributeNS(null,'id','spec-'+N3D.Material.index);
      pattern.setAttributeNS(null,'patternUnits','userSpaceOnUse');
      pattern.setAttributeNS(null,'width',this.width);
      pattern.setAttributeNS(null,'height',this.height);
    
      image.setAttributeNS('http://www.w3.org/1999/xlink','href',this.src);
      image.setAttributeNS(null,'x',0);
      image.setAttributeNS(null,'y',0);
      image.setAttributeNS(null,'width',this.width);
      image.setAttributeNS(null,'height',this.height);
    
      this.patternSVG = pattern;
      that.index = N3D.Material.index++;
    }else if(render instanceof N3D.Graphics.RenderVML){
      var image = document.createElement('vml:image');
      image.style.left = 0;
      image.style.top = 0;
      image.width = this.width;
      image.height = this.height;
      
      that.parent.patternVML = image;
    } 
    that.parent.specular_texture = this;
    that.parent.gl_draw_type = 4;//'TRIANGLES';
    that.loaded = true; 
    that.parent.texture_width = this.width;
    that.parent.texture_height = this.height; 
    if(typeof callback == 'function'){
      callback();
    }
    
  };
  if(this.loaded == true){
    loading.call(this.img);
  }else{
    this.img.onload = loading;
  }    
};


function hexToRGB(color){
  return 'rgb('+(color & 0xFF)+', '+((color /256) & 0xFF)+', '+((color/65536) & 0xFF)+')';
};

N3D.Material.SpecularMap = function(src,color){
  var img = new Image();
    img.src = src;
    this.img = img;
  
  if(arguments.length == 2){
    this.color = hexToRGB(color);
  } 

};

N3D.Material.SpecularMap.prototype.bind = bind;

})();

N3D_Mat = N3D.Material;
N3D_Mat_SpecularMap = N3D.Material.SpecularMap;