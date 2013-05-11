//Shaders for WebGL

N3D.Graphics.Shader = function(){
  

};
N3D.Graphics.Shader.prototype = {
  init:function(ctx,callback){
    var that = this;
    
    var vs = "void main(void){}";
    var fs = "void main(void){}";
    
    function loadFile(src){
      var xmlhttp;
      if (window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
      }else{
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.open("GET",src,false);
      xmlhttp.send();

      
      return xmlhttp.responseText;
    };
    
    
    function loadShader(type,text){
      var shader = ctx.createShader(type);

      ctx.shaderSource(shader, text);
      ctx.compileShader(shader);
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {  
        console.log("An error occurred compiling the shaders: " + ctx.getShaderInfoLog(shader));  
        return null;  
      }
      return shader;
    }

    this.fs = loadFile("shaders/fragment.shader");
    this.vs = loadFile("shaders/vertex.shader");

    this.fragmentShader = loadShader(ctx.FRAGMENT_SHADER,this.fs);
    this.vertexShader = loadShader(ctx.VERTEX_SHADER,this.vs);

    return this;  
  },
  setParameters:function(render){
    var gl = render.context, sP = render.shaderProgram; 
    this.propertyLoaded = [];

    function setAttribute(name){
      var attr = gl.getAttribLocation(sP, name);
      gl.enableVertexAttribArray(attr);
      return attr;
    };

    function setUniform(name){
      return render.context.getUniformLocation(sP, name);
    }

    var line = (this.vs+"\n"+this.fs).split("\n");
    var length = line.length; 
    for(var i=0;i<length;i++){
      var matches = line[i].match(/(attribute|uniform)\s+(\S+)\s+(\S+);/);
      
      if(matches){
        if(matches[1] == "attribute"){
          if(matches[3] !== "aVertexNormal"){
            var name = matches[3];
            this.propertyLoaded.push(name);
            this[name] = setAttribute(name);  
          }
        }else if(matches[1] == "uniform"){
          var name = matches[3];
          this.propertyLoaded.push(name);
          this[name] = setUniform(name);   
        }
      }
      
    } 
  
  }
};

$Shader = N3D.Graphics.Shader;