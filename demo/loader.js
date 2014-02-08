N3D.LoaderOBJ = function(src){
  if(typeof src !== 'string'){ throw new Error('Source not defined'); }
  
  this.src = src;
  this.path = src.substr(0,src.lastIndexOf('/'));
  this.file = new Ajax(src);
  N3D_G_Shape.call(this);
};

N3D.LoaderOBJ.prototype = extend(N3D.LoaderOBJ,N3D.Geometry.Shape);

N3D.LoaderOBJ.prototype.load = function(callback){
  var vertices          = this.vertices;
  var normals           = this.normals;
  var uvs               = this.uvs;
    
  var faces_vertices    = this.faces_vertices;
  var faces_normals     = this.faces_normals;
  var faces_uvs         = this.faces_uvs;
  
  var that = this;
  that.groups = {};
  
  this.file.success = function(text){
    var lines = text.split('\n');
    var line, type;
    
    var vec2_regex = /([\-0-9\.]+)\s+([\-0-9\.]+)/;
    var vec3_regex = /([\-0-9\.]+)\s+([\-0-9\.]+)\s+([\-0-9\.]+)/;
    var faces_regex = /([0-9]+)\/?([0-9]+)?\/?([0-9]+)?\s+([0-9]+)\/?([0-9]+)?\/?([0-9]+)?\s+([0-9]+)\/?([0-9]+)?\/?([0-9]+)?/;

    for(var i=0,length=lines.length;i<length;i++){
      line = lines[i];
      type = line.substr(0,2);
      
      if(type === 'v '){
        line = vec3_regex.exec(line); 
        if(!line){ throw new Error('The line '+i+' can not be parsed'); }
        vertices.push(parseFloat(line[1]),parseFloat(line[2]),parseFloat(line[3]));
      }else if(type === 'vn'){
        line = vec3_regex.exec(line);
        if(!line){ throw new Error('The line '+i+' can not be parsed'); }
        normals.push(parseFloat(line[1]),parseFloat(line[2]),parseFloat(line[3]));
      }else if(type === 'vt'){
        line = vec2_regex.exec(line);
        if(!line){ throw new Error('The line '+i+' can not be parsed'); }
        uvs.push(parseFloat(line[1]),parseFloat(line[2]));
      }else if(type === 'f '){
        line = faces_regex.exec(line);
        if(!line){ throw new Error('The line '+i+' can not be parsed'); }
        
        faces_vertices.push(line[1],line[4],line[7]);
        if(line[2]){
          faces_uvs.push(line[2],line[5],line[8]);
        }
        if(line[3]){
          faces_normals.push(line[3],line[6],line[9]);
        }
      }/*else if(type === 'g '){
        line = line.match(/g\s+(\S+)$/);
        if(!line){ throw new Error('The line '+i+' can not be parsed'); }
        
        that.group = that.groups[line[1]] = {};
        
      }else if(line.substr(0,6) === 'usemtl'){
        line = line.match(/usemtl\s+(\S+)$/);
        if(!line){ throw new Error('The line '+i+' can not be parsed'); }
        that.loadTexture(line[1]);
      } */
      
    }
    
    //console.log(that.groups);
    
    if(vertices.length === 0 || faces_vertices.length === 0){
      this.vertices = null;
      this.faces_vertices = null;
    }
    if(normals.length === 0 || faces_normals.length === 0){
      this.normals = null;
      this.faces_normals = null;
    }
    if(uvs.length === 0 || faces_uvs.length === 0){
      this.uvs = null;
      this.faces_uvs = null;
    }
    
    if(callback){ callback(); }       
  };

};

N3D.LoaderOBJ.prototype.loadTexture = function(name,extension){
  var extension = ['bmp','gif','jpg','jpeg','png'];
  var that = this;
  var path = this.path;
    
  function loader(callback){
    if(extension.length === 0){
      throw new Error('Material not loaded');
    }
    
    var image = new Image();
    image.onerror = function(){
      loader(callback);
      return;
    };
    
    image.onload = callback;
    
    
    image.src = path+'/'+name+'.'+extension.shift(); 
  }
  
  
  loader(function(){
    that.group.material = this;
  });
};


N3D.Loader3DS = function(src){
  if(typeof src !== 'string'){ throw new Error('Source not defined'); }
  
  this.src = src;
  this.path = src.substr(0,src.lastIndexOf('/'));
  this.file = Ajax.LoadBinaryFile(src);
  N3D_G_Shape.call(this);
};

N3D.Loader3DS.prototype = extend(N3D.Loader3DS,N3D.Geometry.Shape);

N3D.Loader3DS.prototype.load = function(){
  function chunker(buffer,max_length,actions,error){
    if(!actions){ return; }
    var id,length,end;
    
    while(((id = buffer.readUInt16(true)) !== -1) && buffer.position<max_length){
      length = buffer.readUInt32(true);
      end = buffer.position + (length-6)*8;        

      if(actions[id]){ 
        actions[id](buffer,end); 
      }else if(error){
        error(id,length);
      }

      buffer.position = end;
    }
  };
  
  var info = {};
  
  function read3DEditor(buffer,max_length){
    chunker(buffer,max_length,{
      0x3d3e:function(){
        info.mesh_version = buffer.readUInt32(true);
      },
      0xAFFF:readMaterialChunk,
      0x4000:readObjectBlock
    },    
    function(id,length){
      //console.log(id.toString(16),length);
    });

  };
  
  function readTriangularMesh(buffer,max_length){
    chunker(buffer,max_length,{
      0x4110:function(){
        console.log(buffer.position/8);
        var length = buffer.readUInt16(true);
        
        for(var i=0;i<length;i++){
          console.log(buffer.readFloat32(true),buffer.readFloat32(),buffer.readFloat32(true));
        }
      }
    },    
    function(id,length){
      console.log(id.toString(16),length);
    });  
  };
  
  function readObjectBlock(buffer,max_length){
    var block = {};
    block.name = buffer.readAsciiZ();
    
    chunker(buffer,max_length,{
      0x4100:readTriangularMesh
    },    
    function(id,length){
      //console.log(id.toString(16),length);
    });
  };
  
  
  
  function readMaterialChunk(buffer,max_length){
    var material = {};

    chunker(buffer,max_length,{
      0xA000:function(){
        material.name = buffer.readAsciiZ();
      }
    },
    function(id,length){
     // console.log(id.toString(16),length-6);
    });
  };
  
  

  this.file.success = function(buffer){
    if(buffer.readUInt16(true) !== 0x4D4D){ throw new Error('File not 3DS'); }
    var length = buffer.readUInt32(true);
    
    chunker(buffer,length,{
      0x0002:function(buffer){ info.version = buffer.readUInt32(true); },
      0x3D3D:read3DEditor,
      0xB000:function(){ console.log('keyframer'); }
    });
     
    
  };
};

