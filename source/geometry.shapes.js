N3D.Geometry.Shapes = function(){
  this.matrix = $M4.Identity();

  this.vectors_position = [];
  this.vectors_texture = [];
  this.vectors_normal = [];

  this.transform = {};
 
  if(N3D.Support.WebGL){
    this.array_position = new Float32Array();
    this.array_texture = new Float32Array();
    this.array_normal = new Float32Array();
    this.array_indices = new Uint16Array();  
  }
 
  return this;
};

N3D.Geometry.Shapes.prototype = {
  gl_draw_type:1,
  constructor:N3D.Geometry.Shapes,
  textured:false,
  backface_culling:false,
  specular_texture:false,
  add:function(o){
    o.parent = this;
    o.world_parent = this.parent;
    if(o instanceof N3D.Graphics.SpecularMap){
      this.specular_map = o;
    }
  },
  updateTransform:function(){
    var trans = this.transform;
    if(typeof trans == "undefined"){ return false; }
    var m = this.matrix = $M4.Identity();    
    var v;

    if(v = trans.translate){
      m.translate(v.x,v.y,v.z);
    } 
    
    if(v = trans.scale){
      m.scale(v.x,v.y,v.z);  
    } 

    if(v = trans.rotateX){
      m.rotateX(v);
    }
    
    if(v = trans.rotateY){
      m.rotateY(v);
    }
    
    if(v = trans.rotateZ){
      m.rotateZ(v);
    }
    
    return this;
  },
  update:function(){
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
  },
  bindBuffer:function(){
    var gl = this.parent.render.context;
    var buffer;
    if(this.parent.render instanceof N3D.Graphics.RenderWebGL){
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_texture), gl.STATIC_DRAW);
      this.buffer_texture = buffer;
    
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_normal), gl.STATIC_DRAW); 
      this.buffer_normal = buffer;
    
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_position), gl.STATIC_DRAW);  
      this.buffer_position = buffer;
    
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.array_indices), gl.STATIC_DRAW);
      this.buffer_indices = buffer; 
    }
    if(this.parent.render instanceof N3D.Graphics.RenderSVG){
      var polygons = this.polygons,
          length = polygons.length,
          render = this.parent.render.group,
          i;
      for(i=0;i<length;i++){
        render.appendChild(polygons[i].triangleSVG);
      }
    }
    
    
    N3D.Geometry.Shapes.Triangle.prototype.draw = N3D.Geometry.Shapes.Triangle.draw;
    
    var that = this;

    this.specular_map.bind(this.parent.render,function(){ 
      if(that.specular_texture){
        var draw = N3D.Geometry.Shapes.Triangle.drawTexture;
        var i,tr = that.polygons,length=tr.length;
        for(i=0;i<length;i++){
          tr[i].draw = draw;
        }
      }
    });
    
    return this;
  }  
};

N3D.Geometry.Shapes.prototype.drawToContext = function(ctx){
  var render = ctx || this.parent.render;
  var material = this.material;

  var backface = render.backfaceCulling;
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

  for(i=0;i<length;i++){
    newPoly[i].draw(render,this);
  }

  return this;  
};

N3D.Geometry.Shapes.LoaderJSON = function(url){
  N3D.Geometry.Shapes.call(this);
  var data = new N3D.Utils.Ajax({
    url:url,
    async:false
  }).text; 
  
  data = data.match(/{([\s\S]+)}/gm)[0];
  data = data.replace(/\n/g,'');
  data = JSON.parse(data);
  
  //data = data.replace(/\s*\/\*([\s\S]+)\*\/\s*(?:var)\s*\w+\s*=\s*|\n+|\s\s+|;$/gm,'');
  
  //console.log(JSON.parse(data));  
  
  this.data = data; 
};

N3D.Geometry.Shapes.LoaderJSON.prototype = extend(N3D.Geometry.Shapes.LoaderJSON,N3D.Geometry.Shapes);
N3D.Geometry.Shapes.LoaderJSON.prototype.init = function(){
  var data = this.data;
  
  //console.log(data);
  
  var f0,f1,f2,v0,v1,v2;
  var result, f_length;
  var vt = [], vn = [], vp = [],
      _vp = [], _vn = [], _vt = [],
      w_ind = [], w_vp = [], w_vt = [], w_vn = [];
     
  if(N3D.Support.WebGL){
    this.array_position = new Float32Array(data.vertices);
    this.array_texture = new Float32Array(data.uvs);
    this.array_normal = new Float32Array(data.normals);

    this.array_indices = new Uint16Array(data.faces); 
    this.indices_length = data.faces.length; 
  } 
};


N3D.Geometry.Shapes.LoaderOBJ = function(url){
  N3D.Geometry.Shapes.call(this);
  var data = new N3D.Utils.Ajax({
    url:url,
    async:false
  }).text;   
  
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
  
  var V2 = N3D.Math.Vector2,V4 = N3D.Math.Vector4;
  
  var regex = /^(v|vt|vn|f)\s+(-?[0-9\.\/]+)\s+(-?[0-9\.\/]+)\s*(-?[0-9\.\/]+)?\s*$/gm;
  var triangle;
  var polygons = [];
  var vec;
  
  var ind_i = 0;

  while((result = regex.exec(data)) !== null){
    if(result[1] == 'vn'){
      vec = new V4(parseFloat(result[2]),parseFloat(result[3]),parseFloat(result[4]),0).normalize();
      vn.push(vec);
      _vn.push(vec.clone());
    }else if(result[1] == 'v'){
      vec = new V4(parseFloat(result[2]),parseFloat(result[3]),parseFloat(result[4]),1);
      vp.push(vec);
      _vp.push(vec.clone());
    }else if(result[1] == 'vt'){
      vec = new V2(parseFloat(result[2]),parseFloat(result[3]));
      vt.push(vec);
      _vt.push(vec.clone());
    }else if(result[1] == 'f'){
      triangle = new N3D.Geometry.Shapes.Triangle();
      f0 = result[2].split("/");
      f1 = result[3].split("/");
      f2 = result[4].split("/");
    
      triangle.parent = this;
    
      f_length = f0.length;
    
      v0 = (+f0[0])-1;
      v1 = (+f1[0])-1;
      v2 = (+f2[0])-1;

      w_ind.push(ind_i++,ind_i++,ind_i++);

      v0 = vp[v0];
      v1 = vp[v1];
      v2 = vp[v2];

      triangle.setVectorsPosition(v0,v1,v2);
      
      var u = $V3.Sub(v1,v0);
      var v = $V3.Sub(v2,v0);
      
      var vn0 = u.cross(v).normalize();

      w_vp = w_vp.concat(v0.xyz(),v1.xyz(),v2.xyz());

      if(f_length>=2 && f0[1] !== ''){
        v0 = vt[(+f0[1])-1];
        v1 = vt[(+f1[1])-1];
        v2 = vt[(+f2[1])-1]; 
      
        w_vt = w_vt.concat(v0.xy(),v1.xy(),v2.xy()); 
        triangle.setVectorsTexture(v0,v1,v2);
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

    this.array_indices = new Uint16Array(w_ind); 
    this.indices_length = w_ind.length; 
  }
  
  return this;
};

N3D.Geometry.Shapes.Cube = function(){
  N3D.Geometry.Shapes.call(this);

};

N3D.Geometry.Shapes.Cube.prototype = extend(N3D.Geometry.Shapes.Cube,N3D.Geometry.Shapes);
N3D.Geometry.Shapes.Cube.prototype.init = function(){
  this.vectors_position = [
    0,0,0,
    1,0,0,
    1,1,0,
    0,1,0
  ];

  this.indices_length = 2; 
};


N3D.Geometry.Shapes.Block = function(){};
N3D.Geometry.Shapes.Sphere = function(){};

N3D.Geometry.Shapes.Elipse = function(){};
N3D.Geometry.Shapes.Circle = function(){};
N3D.Geometry.Shapes.Square = function(){};
N3D.Geometry.Shapes.Rectangle = function(){
  N3D.Geometry.Shapes.call(this);
};
N3D.Geometry.Shapes.Rectangle.prototype = extend(N3D.Geometry.Shapes.Rectangle,N3D.Geometry.Shapes);
N3D.Geometry.Shapes.Rectangle.prototype.init = function(){
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
  
  var V2 = N3D.Math.Vector2,V4 = N3D.Math.Vector4;

  var polygons = [],v0, v1, v2;

  var vec,triangle;
  for(var i=0;i<12;i+=3){
    vec = new V4(w_vp[i],w_vp[i+1],w_vp[i+2],1);
    vp.push(vec);
    _vp.push(vec.clone());
  } 
  
  for(var i=0;i<6;i+=3){
    triangle = new N3D.Geometry.Shapes.Triangle();  
    v0 = vp[w_ind[i]];
    v1 = vp[w_ind[i+1]];
    v2 = vp[w_ind[i+2]];

    triangle.setVectorsPosition(v0,v1,v2);
    polygons.push(triangle);
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
//Trojúhelníky
N3D.Geometry.Shapes.Triangle = function(){};
N3D.Geometry.Shapes.Triangle.prototype = {
  isVisible:true,
  triangle:null,
  setVectorsPosition:function(v0,v1,v2){
    this.vp0 = v0;
    this.vp1 = v1;
    this.vp2 = v2;
    if(N3D.Support.SVG){
      var triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); 
      triangle.setAttributeNS(null,'points',v0.x+" "+v0.y+" "+v1.x+" "+v1.y+" "+v2.x+" "+v2.y);
      triangle.setAttributeNS(null,'opacity','0');
      this.triangleSVG = triangle;
    }    
  },
  setVectorsNormal:function(v0,v1,v2){
    this.vn0 = v0;
    this.vn1 = v1;
    this.vn2 = v2; 
  },
  setVectorsTexture:function(v0,v1,v2){
    this.vt0 = v0;
    this.vt1 = v1;
    this.vt2 = v2;
    if(this.triangleSVG !== null){
      this.triangleSVG.setAttributeNS(null,'points',(v0.x*512)+" "+((1-v0.y)*512)+" "+(v1.x*512)+" "+((1-v1.y)*512)+" "+(v2.x*512)+" "+((1-v2.y)*512));
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

$OBJ = N3D.Geometry.Shapes.LoaderOBJ;