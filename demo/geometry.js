N3D.Geometry = {};
N3D.Geometry.Shape = function(){
  this.vertices = [];
  this.normals = [];
  this.uvs = [];
    
  this.faces_vertices = [];
  this.faces_normals = [];
  this.faces_uvs = []; 
  
  this.matrix = N3D_M_Matrix4.Identity();
};

N3D.Geometry.Shape.prototype.vertices = null;
N3D.Geometry.Shape.prototype.normals = null;
N3D.Geometry.Shape.prototype.uvs = null;

N3D.Geometry.Shape.prototype.n3d_vertices = null;

N3D.Geometry.Shape.prototype.texture = null;

N3D.Geometry.Shape.prototype.init = function(){
  var v, n3d_vp, n3d_vn, n3d_vt, n3d_f;
  var _n3d_vp, _n3d_vn, _n3d_vt, _n3d_f;
  var i, n, length;
  
  
  
  
  //Vertices
  v = this.vertices;
  if(v){
    n3d_vp = this.n3d_vertices = [];
    _n3d_vp = this._n3d_vertices = [];
    
    var min = new N3D_M_Vector4(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE,1);
    var max = new N3D_M_Vector4(Number.MIN_VALUE,Number.MIN_VALUE,Number.MIN_VALUE,1);
    
    for(n=0,i=0,length = v.length;i<length;i+=3,n++){
      n3d_vp[n] = new N3D_M_Vector4(v[i],v[i+1],v[i+2],1);
      _n3d_vp[n] = n3d_vp[n].clone();
      N3D_M_Vector4.Max(max,n3d_vp[n],max);
      N3D_M_Vector4.Min(max,n3d_vp[n],min);
    }
    
    this.position = max.sub(min);
  }

  
  //Normals
  v = this.normals;
  if(v){
    n3d_vn = this.n3d_normals = [];
    for(n=0,i=0,length = v.length;i<length;i+=3,n++){
      n3d_vn[n] = new N3D_M_Vector3(v[i],v[i+1],v[i+2]);
    }
  }
  
  v = this.uvs;
  if(v){
    n3d_vt = this.n3d_uvs = [];
    for(n=0,i=0,length = v.length;i<length;i+=2,n++){
      n3d_vt[n] = new N3D_M_Vector2(v[i],v[i+1]);
    }
  }
  
  n3d_f = this.n3d_triangles = [];

  if(v = this.faces_vertices){
    for(n=0,i=0,length = v.length;i<length;i+=3,n++){
      triangle = new N3D_G_Triangle();
      triangle.vp0 = n3d_vp[ v[i  ]-1 ];
      triangle.vp1 = n3d_vp[ v[i+1]-1 ];
      triangle.vp2 = n3d_vp[ v[i+2]-1 ];
      
      n3d_f[n] = triangle;
    }
  }else{
    throw new Error('Faces array is empty');
  }
  
  if(v = this.faces_normals){
    for(n=0,i=0,length = v.length;i<length;i+=3,n++){
      triangle = n3d_f[n];
      triangle.vn0 = n3d_vn[ v[i  ]-1 ];
      triangle.vn1 = n3d_vn[ v[i+1]-1 ];
      triangle.vn2 = n3d_vn[ v[i+2]-1 ];
    }
  }
  

  if(v = this.faces_uvs){
    for(n=0,i=0,length = v.length;i<length;i+=3,n++){
      triangle = n3d_f[n];
      triangle.vt0 = n3d_vt[ v[i  ]-1 ];
      triangle.vt1 = n3d_vt[ v[i+1]-1 ];
      triangle.vt2 = n3d_vt[ v[i+2]-1 ];
    }
  }
};

N3D.Geometry.Shape.prototype.setCenter = function(v){
  N3D.command(function(){
    var n3d_vp = this._n3d_vertices;
    var position = this.position;
    
    for(var i=0,length=n3d_vp.length;i<length;i++){
      n3d_vp[i].sub(position);
    }
  },this);
    
};


N3D.Geometry.Shape.prototype.addTexture = function(o){    //Vymyslet jinak!
  if(typeof o === 'string'){
    var img = new Image();
    var that = this;
    img.onload = function(){
      var count = 0;
      
      var m = new N3D_M_Matrix2(
        img.width,0,
        0,  -img.height
      ); 
      var v_add = new N3D_M_Vector2(0,1);
      
      N3D.command(function(){
        var vt,vts = this.n3d_uvs;

        var last_y;
        for(var i=0,length = vts.length;i<length;i++){
          vt = vts[i];
          vt.add(v_add);
          vt.multiplyMatrix2(m); 
        }
        this.texture = img;   
        
        if(N3D.render instanceof N3D.Graphics.RenderCanvas){
          this.texture_pattern = N3D.render.context.createPattern(img,'no-repeat');
        }
        
      },that);

    };
    img.src = o;
    
    
  }
};


N3D.Geometry.Triangle = function(){ };

N3D_G_Shape = N3D.Geometry.Shape;
N3D_G_Triangle = N3D.Geometry.Triangle;