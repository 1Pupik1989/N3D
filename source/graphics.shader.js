
(function(){
function parsing(that,shaderName,url){
  var data = new N3D.Utils.Ajax({
    url:url,
    async:false
  }).text;
  
  
  var regex = /^(varying|uniform|attribute|precision)\s+(.*?)\s+(.*?);?$/gm; 
  var store = {};
  while((result = regex.exec(data)) !== null){
    var prop = result[1];
    var type = result[2];
    var name = result[3];
    
    if(typeof store[prop] == 'undefined'){
      store[prop] = [];  
    }

    store[prop].push([name,type]);
  }
  
  
  that[shaderName+'Source'] = data;
  
  return store;
};

N3D.Graphics.Shader = function(vs_url,fs_url){
  this.vertexStore = parsing(this,'vertex',vs_url);
  this.fragmentStore = parsing(this,'fragment',fs_url);
  
  return this;  
};
N3D.Graphics.Shader.prototype = {
  bind:function(render){
    var that = this, gl = render.context, sP = render.shaderProgram, name = '';

    function setUniform(name){
      return gl.getUniformLocation(sP, name);
    };

    function setAttribute(name){
      var attr = gl.getAttribLocation(sP, name);
      gl.enableVertexAttribArray(attr);
      return attr;
    };
    
    function loader(arr,func){
      if(typeof arr == 'undefined'){ return false;}
      var length = arr.length;
      for(var i=0;i<length;i++){
        name = arr[i][0];
        that[name] = func(name);
      }  
    };

    loader(this.vertexStore.uniform,setUniform);
    loader(this.fragmentStore.uniform,setUniform);
    
    loader(this.vertexStore.attribute,setAttribute);
    loader(this.fragmentStore.attribute,setAttribute);

  }
};

})();

N3D.Graphics.Shader.loaded = true;

$Shader = N3D.Graphics.Shader;