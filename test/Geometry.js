N3D.Geometry = {};


/* >>>> Geometry.Shapes >>>> */
N3D.Geometry.Shapes = function(){
  this.matrix = N3D_M_Matrix4.Identity();
  
  this.polygons = [];
  
  this.vectors_position = [];
  this.vectors_texture = [];
  this.vectors_normal = [];  
  
  this._vectors_position = [];                
  this._vectors_normal = [];
  this._vectors_texture = []; 
   
  if(N3D.Support.WebGL){
    this.array_position = new Float32Array([]);
    this.array_texture = new Float32Array([]);
    this.array_normal = new Float32Array([]);
    this.array_color = new Float32Array([]);

    this.array_indices = new Uint16Array([]); 
    this.indices_length = 0;
  }

  N3D.Models[this.name] = this;

  this.transform = {};
 
  return this;
};

N3D.Geometry.Shapes.prototype = {
  gl_draw_type:1,
  constructor:N3D.Geometry.Shapes,
  textured:false,
  backface_culling:false,
  specular_texture:false,
  specular_color:"rgba(255,128,0,1)"
};
N3D.Geometry.Shapes.prototype.add = function(o){
  o.parent = this;
  o.world_parent = this.parent;
  if(o instanceof N3D_Mat_SpecularMap){
    this.specular_map = o;
  }else if(o instanceof N3D_G_Triangle){
    this.polygons.push(o);
  }
};
N3D.Geometry.Shapes.prototype.updateTransform = function(){
  var trans = this.transform;
  if(typeof trans == "undefined"){ return false; }
  var m = this.matrix = N3D_M_Matrix4.Identity();    
  var v;

  if(v = trans.translate){ m.translate(v.x,v.y,v.z); }   
  if(v = trans.scale){ m.scale(v.x,v.y,v.z); }
  if(v = trans.rotateX){ m.rotateX(v); }    
  if(v = trans.rotateY){ m.rotateY(v); }    
  if(v = trans.rotateZ){ m.rotateZ(v); }
  
  return this;
};
N3D.Geometry.Shapes.prototype.update = function(){
  var camera = this.parent.camera;

  var MVP = this.matrix.multiply(camera.projectionViewMatrix),
      vp = this.vectors_position,
      _vp = this._vectors_position,
      i,vp_length = vp.length,
      
      screen_width = this.parent.viewport.width,
      screen_height = this.parent.viewport.height;

  for(i=0;i<vp_length;i++){
    vp[i].copyFromVector4(_vp[i]).multiplyMatrix4(MVP).toHomogenous(screen_width,screen_height);
  }

  return this;
};
N3D.Geometry.Shapes.prototype.bindBuffer = function(){
  var gl = this.parent.render.context;
  var buffer;
  if(this.parent.render instanceof N3D.Graphics.RenderWebGL){
    if(this.array_texture.length){
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_texture), gl.STATIC_DRAW);
      this.buffer_texture = buffer;
    }
    if(this.array_color.length){
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_color), gl.STATIC_DRAW);
      this.buffer_color = buffer;
    }
    
    if(this.array_normal.length){
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_normal), gl.STATIC_DRAW); 
      this.buffer_normal = buffer;
    } 
       
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_position), gl.STATIC_DRAW);  
    this.buffer_position = buffer;
  
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.array_indices), gl.STATIC_DRAW);
    this.buffer_indices = buffer; 
  }else if(this.parent.render instanceof N3D.Graphics.RenderSVG){
    var polygons = this.polygons,
        length = polygons.length,
        render = this.parent.render.group,
        i;
    for(i=0;i<length;i++){
      render.appendChild(polygons[i].triangleSVG);
    }
  }else if(this.parent.render instanceof N3D.Graphics.RenderVML){
    var polygons = this.polygons,
        length = polygons.length,
        render = this.parent.render.group,
        i;
    for(i=0;i<length;i++){
      render.appendChild(polygons[i].triangleVML);
    }
  }
  
  
  N3D_G_Triangle.prototype.draw = N3D_G_Triangle.draw;
  
  var that = this;
  if(this.specular_map){
    this.specular_map.bind(this.parent.render,function(){ 
      if(that.specular_texture){
        var draw = N3D_G_Triangle.drawTexture;
        var i,tr = that.polygons,length=tr.length;
        for(i=0;i<length;i++){
          tr[i].draw = draw;
        }
      }
    });
  }
  
  return this;
};

N3D.Geometry.Shapes.prototype.drawToContext = function(ctx){
  var ctx = ctx || this.parent.render.context;
  var material = this.material;

  var backface = this.parent.render.backfaceCulling;
  var newPoly = [];
  var polygons = this.polygons;
  var length = polygons.length;
  var i; 
  
  for(i=0;i<length;i++){
    poly = polygons[i]; 
    if(poly.projectSettings(backface) == true){
      newPoly.push(poly);
    }      
  }
  newPoly.sort(function sort(a,b){
    return (b.depthInt - a.depthInt);
  });
  
  
  
  length = newPoly.length;
  //length = 50; //For testing IE

  for(i=0;i<length;i++){
    newPoly[i].draw(ctx,this);
  }

  return this;  
};

N3D.Geometry.Shapes.LoaderJSON = function(url){

  var data = new N3D_U_Ajax({
    url:url,
    async:false
  }).text; 
  
  this.name = url.replace(/^[^\/]+\/|\.(\w+)$/g,'');
  
  data = data.match(/{([\s\S]+)}/gm)[0];
  data = data.replace(/\n/g,'');
  data = JSON.parse(data);

  this.data = data; 
  N3D.Geometry.Shapes.call(this);
};

N3D.Geometry.Shapes.LoaderJSON.prototype = extend(N3D.Geometry.Shapes.LoaderJSON,N3D.Geometry.Shapes);
N3D.Geometry.Shapes.LoaderJSON.prototype.init = function(){
  var data = this.data;
  
  var f0,f1,f2,f3,v0,v1,v2,v3;
  var result, f_length;
  var vt = [], vn = [], vp = [],
      _vp = [], _vn = [], _vt = [],
      w_ind = [], w_vp = [], w_vt = [], w_vn = [];
  
  
  var i,length;
  
  var faces = data.faces;
  var triangle;
  
  var points = data.vertices;
  
  for(i=0,length=points.length;i<length;i+=3){
    vec = new N3D_M_Vector4(points[i],points[i+1],points[i+2],1);
    vp.push(vec);
    _vp.push(vec.clone());
  }
  
  points = data.normals;
  
  if(points && (length = points.length)>0){
    
    for(i=0;i<length;i+=3){
      vec = new N3D_M_Vector4(points[i],points[i+1],points[i+2],0);
      vn.push(vec);
      _vn.push(vec.clone());
    }
  }
  
  points = data.uvs;
  
  if(points && (length = points.length)>0){
    for(i=0;i<length;i+=2){
      vec = new N3D_M_Vector2(points[i],points[i+1]);
      vt.push(vec);
      _vt.push(vec.clone());
    }
  }
  
  
  function getMask(n){
    var out = parseInt(n,10).toString(2);
    out = ("00000000"+out).substr(out.length,8).split('').reverse();

    var shapeType = out[0] == 0 ? 3 : 4;
    var addIndex = shapeType;
    var o = {};
    o.shapeType = shapeType;              //0 = (0 indices or 3 - 4 indices)
    addIndex += +(o.facesMaterial = (out[1] == '1'));    //1 = (0 index or 1 index)
    addIndex += +(o.facesUvs = (out[2] == '1'));         //2 = (0 index or 1 index)
    addIndex += (o.facesVertexUvs = (+out[3])*shapeType);         //3 =  (0 indices or 3 - 4 indices)
    addIndex += +(o.faceNormal = (out[4] == '1'));
    addIndex += (o.faceVertexNormal = (+out[5])*shapeType); 
    addIndex += +(o.faceColor = (out[6] == '1'));
    addIndex += (o.faceVertexColor = (+out[7])*shapeType); 

    o.addIndex = addIndex+1;

    return o;
  };
  
  var result; 

  var ind_i = 0;
  var w_color = [];

  for(i=0,length=faces.length;i<length;){
    result = getMask(faces[i]);
    
    if(result.shapeType == 3){
      v0 = vp[faces[i+1]];
      v1 = vp[faces[i+2]];
      v2 = vp[faces[i+3]];

      triangle = new N3D_G_Triangle(v0,v1,v2);

      this.add(triangle);
      
      w_vp = w_vp.concat(v0.xyz(),v1.xyz(),v2.xyz());
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_ind.push(ind_i++,ind_i++,ind_i++);      
    }else if(result.shapeType == 4){
      v0 = vp[faces[i+1]];
      v1 = vp[faces[i+2]];
      v2 = vp[faces[i+3]];
      v3 = vp[faces[i+4]];

      
      triangle = new N3D_G_Triangle(v0,v1,v2);
      this.add(triangle);
      
      w_vp = w_vp.concat(v0.xyz(),v1.xyz(),v2.xyz());
      w_ind.push(ind_i++,ind_i++,ind_i++);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      
      
      
      triangle = new N3D_G_Triangle(v0,v2,v3);
      this.add(triangle);
      
      w_vp = w_vp.concat(v0.xyz(),v2.xyz(),v3.xyz());
      w_ind.push(ind_i++,ind_i++,ind_i++);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);                       
    }

    i+=result.addIndex;
  } 

  this.vectors_position = vp;
  this.vectors_texture = vt;
  this.vectors_normal = vn;  
  
  this._vectors_position = _vp;                
  this._vectors_normal = _vn;
  this._vectors_texture = _vt;
   
  if(N3D.Support.WebGL){
    this.array_position = new Float32Array(w_vp);
    this.array_texture = new Float32Array(w_vt);
    this.array_normal = new Float32Array(w_vn);
    this.array_color = new Float32Array(w_color);

    this.array_indices = new Uint16Array(w_ind); 
    
    this.indices_length = w_ind.length; 
  } 
  
  return this;
};


N3D.Geometry.Shapes.LoaderOBJ = function(url){
  N3D.Geometry.Shapes.call(this);
  var data = new N3D_U_Ajax({
    url:url,
    async:false
  }).text;   
  
  this.name = url.replace(/^[^\/]+\/|\.(\w+)$/g,'');
  this.data = data;  
};

N3D.Geometry.Shapes.LoaderOBJ.prototype = extend(N3D.Geometry.Shapes.LoaderOBJ,N3D.Geometry.Shapes);
N3D.Geometry.Shapes.LoaderOBJ.prototype.init = function(){
  var data = this.data;
  
  var f0,f1,f2,v0,v1,v2;
  var result, f_length;
  var vt = [], vn = [], vp = [],
      _vp = [], _vn = [], _vt = [],
      w_ind = [], w_vp = [], w_vt = [], w_vn = [];
  
  var regex = /^(v|vt|vn|f)\s+(-?[0-9\.\/]+)\s+(-?[0-9\.\/]+)\s*(-?[0-9\.\/]+)?\s*$/gm;
  var triangle;
  var polygons = [];
  var vec;
  
  var ind_i = 0;
  var w_color = [];

  while((result = regex.exec(data)) !== null){
    if(result[1] == 'vn'){
      vec = new N3D_M_Vector4(parseFloat(result[2]),parseFloat(result[3]),parseFloat(result[4]),0).normalize();
      vn.push(vec);
      _vn.push(vec.clone());
    }else if(result[1] == 'v'){
      vec = new N3D_M_Vector4(parseFloat(result[2]),parseFloat(result[3]),parseFloat(result[4]),1);
      vp.push(vec);
      _vp.push(vec.clone());
    }else if(result[1] == 'vt'){
      vec = new N3D_M_Vector2(parseFloat(result[2]),parseFloat(result[3]));
      vt.push(vec);
      _vt.push(vec.clone());
    }else if(result[1] == 'f'){
      
      f0 = result[2].split("/");
      f1 = result[3].split("/");
      f2 = result[4].split("/");
    
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
      w_color.push(Math.random(),Math.random(),Math.random(),1);
    
      f_length = f0.length;
    
      v0 = (+f0[0])-1;
      v1 = (+f1[0])-1;
      v2 = (+f2[0])-1;

      w_ind.push(ind_i++,ind_i++,ind_i++);

      v0 = vp[v0];
      v1 = vp[v1];
      v2 = vp[v2];
      triangle = new N3D_G_Triangle(v0,v1,v2);
      triangle.parent = this;
      
      var u = N3D_M_Vector3.Sub(v1,v0);
      var v = N3D_M_Vector3.Sub(v2,v0);
      
      var vn0 = u.cross(v).normalize();

      w_vp = w_vp.concat(v0.xyz(),v1.xyz(),v2.xyz());

      if(f_length>=2 && f0[1] !== ''){
        v0 = vt[(+f0[1])-1];
        v1 = vt[(+f1[1])-1];
        v2 = vt[(+f2[1])-1]; 
      
        w_vt = w_vt.concat(v0.xy(),v1.xy(),v2.xy()); 
        triangle.setUVs(v0,v1,v2);
      }
    
      if(f_length>=3 && f0[2] !== ''){
        v0 = vn[(+f0[2])-1];
        v1 = vn[(+f1[2])-1];
        v2 = vn[(+f2[2])-1]; 
      
        w_vn = w_vn.concat(v0.xyz(),v1.xyz(),v2.xyz());
      }else{
        v0 = vn0;
        v1 = vn0;
        v2 = vn0;
        
        vn0 = vn0.xyz();
        
        w_vn = w_vn.concat(vn0,vn0,vn0);
      } 
  
      triangle.setVectorsNormal(v0,v1,v2);
      polygons.push(triangle);
    }
    
    
  }
  this.polygons = polygons;
  
  this.vectors_position = vp;
  this.vectors_texture = vt;
  this.vectors_normal = vn;  
  
  this._vectors_position = _vp;                
  this._vectors_normal = _vn;
  this._vectors_texture = _vt;
   
  if(N3D.Support.WebGL){
    this.array_position = new Float32Array(w_vp);
    this.array_texture = new Float32Array(w_vt);
    this.array_normal = new Float32Array(w_vn);
    this.array_color = new Float32Array(w_color);

    this.array_indices = new Uint16Array(w_ind); 
    this.indices_length = w_ind.length; 
  }
  
  return this;
};

N3D.Geometry.Cube = function(){
  N3D.Geometry.Shapes.call(this);

};

N3D.Geometry.Cube.prototype = extend(N3D.Geometry.Cube,N3D.Geometry.Shapes);
N3D.Geometry.Cube.prototype.init = function(){
  this.vectors_position = [
    0,0,0,
    1,0,0,
    1,1,0,
    0,1,0
  ];

  this.indices_length = 2; 
  return this;
};


N3D.Geometry.Block = function(){};
N3D.Geometry.Sphere = function(){};

N3D.Geometry.Elipse = function(){};
N3D.Geometry.Circle = function(){};
N3D.Geometry.Square = function(){};
N3D.Geometry.Rectangle = function(){
  N3D.Geometry.Shapes.call(this);
};
N3D.Geometry.Rectangle.prototype = extend(N3D.Geometry.Rectangle,N3D.Geometry.Shapes);
N3D.Geometry.Rectangle.prototype.init = function(){
  var vt = [], vn = [], vp = [],
      _vp = [], _vn = [], _vt = [];
  
  var w_vp = [
    0,0,0,
    1,0,0,
    1,1,0,
    0,1,0
  ];
  
  var w_ind = [
    0,1,2,
    0,2,3
  ];
  
  var w_vt = [
    0,0,
    1,0,
    1,1,
    0,1    
  ];
  
  var w_vn = [];
 
  var polygons = [],v0, v1, v2;

  var vec,triangle;
  for(var i=0;i<12;i+=3){
    vec = new N3D_M_Vector4(w_vp[i],w_vp[i+1],w_vp[i+2],1);
    vp.push(vec);
    _vp.push(vec.clone());
  } 
  
  for(var i=0;i<6;i+=3){
    v0 = vp[w_ind[i]];
    v1 = vp[w_ind[i+1]];
    v2 = vp[w_ind[i+2]];
    triangle = new N3D_G_Triangle(v0,v1,v2);  

    this.add(triangle);
  }
  
  this.polygons = polygons;
  
  this.vectors_position = vp;
  this.vectors_texture = vt;
  this.vectors_normal = vn;  
  
  this._vectors_position = _vp;                
  this._vectors_normal = _vn;
  this._vectors_texture = _vt;
   
  if(N3D.Support.WebGL){
    this.array_position = new Float32Array(w_vp);
    this.array_texture = new Float32Array(w_vt);
    this.array_normal = new Float32Array(w_vn);
    this.array_indices = new Uint16Array(w_ind); 
    this.indices_length = w_ind.length; 
  }
  
  this.indices_length = 2; 
};


N3D.Geometry.Triangle = function(v0,v1,v2){
  this.vp0 = v0;
  this.vp1 = v1;
  this.vp2 = v2;

  if(N3D.Support.SVG){
    var triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); 
    triangle.setAttributeNS(null,'points',v0.x+" "+v0.y+" "+v1.x+" "+v1.y+" "+v2.x+" "+v2.y);
    triangle.setAttributeNS(null,'opacity','0');
    
    this.triangleSVG = triangle;
  }
  if(N3D.Support.VML){
    var triangle = document.createElement('vml:shape'); 
    triangle.path = 'm '+v0.x+" "+v0.y+" l "+v1.x+" "+v1.y+" "+v2.x+" "+v2.y+'x e';
    triangle.style.width = '100';
    triangle.style.height = '100';

    triangle.style.display = 'none';

    this.triangleVML = triangle;
  }
};
N3D.Geometry.Triangle.prototype = {
  isVisible:true,
  triangle:null,
  triangleVML:null,
  triangleSVG:null,
  add:function(o){
    o.parent = this;
    if(o instanceof N3D.Graphics.ColorPalette){
    
    }
  },
  setVectorsNormal:function(v0,v1,v2){
    this.vn0 = v0;
    this.vn1 = v1;
    this.vn2 = v2; 
  },
  setUVs:function(v0,v1,v2){
    this.vt0 = v0;
    this.vt1 = v1;
    this.vt2 = v2;
    
    if(this.triangleSVG !== null){
      this.triangleSVG.setAttributeNS(null,'points',(v0.x*512)+" "+((1-v0.y)*512)+" "+(v1.x*512)+" "+((1-v1.y)*512)+" "+(v2.x*512)+" "+((1-v2.y)*512));
    }
    if(this.triangleVML !== null){
      this.triangleVML.path = 'm '+Math.floor(v0.x*512)+", "+Math.floor((1-v0.y)*512)+" l "+Math.floor(v1.x*512)+", "+Math.floor((1-v1.y)*512)+" "+Math.floor(v2.x*512)+", "+Math.floor((1-v2.y)*512)+' x e';
    }
  },
  setVertexColors:function(c0,c1,c2){
    this.c0 = c0;
    this.c1 = c1;
    this.c2 = c2;
  },
  projectSettings:function(backface){
    var p0 = this.vp0,
        p1 = this.vp1,
        p2 = this.vp2;

    if(p0.draw == false || p1.draw == false || p2.draw == false){
      return false;
    }

    this.depthInt = Math.min(p0.z,p1.z,p2.z);
    return (backface == false ? true : ((p1.x-p0.x) * (p2.y-p0.y) - (p1.y-p0.y) * (p2.x-p0.x) > 0)); 
  }
};


N3D.Geometry.Grid = function(sizeX,sizeZ){
  N3D.Geometry.Shapes.call(this);
  var polygons = [];
  var vp = [],_vp = [];
  var halfX = -sizeX*0.5;
 
  sizeX++;
  sizeZ++;
 
  var i,one = 1/sizeZ,length = sizeX * sizeZ;
  var v0,v1,v2,v3;
  var v,x,z;
  


  for(i=0;i<length;i++){
    z = ~~(i*one);
    x = i-(z*sizeZ);
    v = new N3D_M_Vector4(x+halfX,0,z,1);
    vp.push(v);
    _vp.push(v.clone());
  }
  
  length -= sizeX+1;
  
  var ind_i = 0;
  var w_ind = [], w_vp = [];
   

  for(i=0;i<length;i++){
    if((i+1)%sizeZ ==0 && i!=0){ continue; }
    v0 = vp[i];
    v1 = vp[i+1];
    v2 = vp[i+sizeZ+1];
    v3 = vp[i+sizeZ];
    
    polygons.push(new N3D_G_Triangle(v0,v1,v2));
    w_ind.push(ind_i++,ind_i++);
    w_vp.push(v0.x,v0.y,v0.z);
    w_vp.push(v1.x,v1.y,v1.z);
    
    w_ind.push(ind_i++,ind_i++);
    w_vp.push(v0.x,v0.y,v0.z);
    w_vp.push(v3.x,v3.y,v3.z);


    polygons.push(new N3D_G_Triangle(v0,v2,v3));
    w_ind.push(ind_i++,ind_i++);
    w_vp.push(v1.x,v1.y,v1.z);
    w_vp.push(v2.x,v2.y,v2.z);
    
    w_ind.push(ind_i++,ind_i++);
    w_vp.push(v2.x,v2.y,v2.z);
    w_vp.push(v3.x,v3.y,v3.z);
  }
  
  this.polygons = polygons;
  
  this.vectors_position = vp;
  //this.vectors_texture = vt;
  //this.vectors_normal = vn;  
  
  this._vectors_position = _vp;                
  //this._vectors_normal = _vn;
  //this._vectors_texture = _vt;
   
  if(N3D.Support.WebGL){
    this.array_position = new Float32Array(w_vp);
    //this.array_texture = new Float32Array(w_vt);
    //this.array_normal = new Float32Array(w_vn);
    this.array_indices = new Uint16Array(w_ind); 
    this.indices_length = w_ind.length; 
  }
  
};

N3D.Geometry.Grid.prototype = extend(N3D.Geometry.Grid,N3D.Geometry.Shapes);
N3D.Geometry.Grid.prototype.init = function(){
  return this;
};


/* <<<< Geometry.Shapes <<<< */


N3D.Geometry.HeightMap = function(url){
  N3D.Geometry.Shapes.call(this);
  var image = new Image();
  image.src = url;
  this.image = image; 
};
N3D.Geometry.HeightMap.prototype = extend(N3D.Geometry.HeightMap,N3D.Geometry.Shapes);
N3D.Geometry.HeightMap.prototype.init = function(){
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var that = this;
  this.image.onload = function(){
    var width = canvas.width = this.width;
    var height = canvas.height = this.height;
    
    ctx.drawImage(this,0,0);
    
    var inv_mag = 1/(4*255);
    var data = ctx.getImageData(0,0,width,height).data;
    var i,v,length = data.length;
    var vp = [], vt = [];
    var _vp = [], _vt = [];
    
    var x = 0,y,z = 0;
    
    for(i=0;i<length;i+=4){
      y = (data[i]+data[i+1]+data[i+2]+data[i+3])*inv_mag;

      v = new N3D_M_Vector4(x,y,z,1);

      vp.push(v);
      _vp.push(v.clone());
      
      v = new N3D_M_Vector2(x,z);
      vt.push(v);
      _vt.push(v.clone());
      
      x++;
      if(x==width){
        x = 0;
        z++; 
      }
    }
    
    var render = that.parent.render.context;
    length = vp.length-width-1;
    var v0,v1,v2,v3;
    var vt0,vt1,vt2,vt3;
    var polygons = [];
    var triangle;
    
    for(i=0;i<length;i++){
      if((i+1)%width == 0 && i!=0){ continue; }

      v0 = vp[i];
      v1 = vp[i+1];
      v2 = vp[i+width+1];
      v3 = vp[i+width];
      
      vt0 = vt[i];
      vt1 = vt[i+1];
      vt2 = vt[i+width+1];
      vt3 = vt[i+width];
      
      var y_norm = (v0.y*v1.y*v2.y*v3.y); 
      y = ~~(y_norm*255);
      y_norm = 1;
      
      /*render.fillStyle = 'rgba('+y+','+y+','+y+','+y_norm+')';
      render.beginPath();
      render.moveTo(v0.x,v0.z);
      render.lineTo(v1.x,v1.z);
      render.lineTo(v2.x,v2.z);
      render.lineTo(v3.x,v3.z);
      render.closePath();
      render.fill(); */
      
      triangle = new N3D_G_Triangle(v0,v1,v2);
      triangle.setUVs(vt0,vt1,vt2);
      polygons.push(triangle);
      
      triangle = new N3D_G_Triangle(v0,v2,v3);
      triangle.setUVs(vt0,vt2,vt3);
      polygons.push(triangle);
    }
    
    
    that.polygons = polygons;
    that.vectors_position = vp;
    //this.vectors_texture = vt;
    //this.vectors_normal = vn;  
  
    that._vectors_position = _vp;                
    //this._vectors_normal = _vn;
    //this._vectors_texture = _vt;
   
    if(N3D.Support.WebGL){
      //this.array_position = new Float32Array(w_vp);
      //this.array_texture = new Float32Array(w_vt);
      //this.array_normal = new Float32Array(w_vn);
      //this.array_indices = new Uint16Array(w_ind); 
      //this.indices_length = w_ind.length; 
    }

  };

  return this;
};



N3D_G = N3D.Geometry;
N3D_G_HeightMap = N3D.Geometry.HeightMap;
N3D_G_Grid = N3D.Geometry.Grid;
N3D_G_Shapes = N3D.Geometry.Shapes;
N3D_G_Triangle = N3D.Geometry.Triangle;