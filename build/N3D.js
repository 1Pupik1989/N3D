var N3D = {};

var Vector2 = function(x,y){
  this.x = x;
  this.y = y;

  return this;
};
Vector2.prototype = {
  constructor:Vector2,
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x;
    this.y -= v.y;
    
    return this;  
  },
  multiply:function(){
    this.x *= v.x;
    this.y *= v.y;
    
    return this;  
  },
  divide:function(){
    this.x /= v.x;
    this.y /= v.y;
    
    return this;  
  },
  multiplyNumber:function(n){
    this.x *= n;
    this.y *= n;
    
    return this;
  },
  toString:function(){
    return "N3D.Vector2("+this.x+","+this.y+")";
  },
  negative:function(){
    return this.scale(-1);
  }  
};

Vector2.Equals = function(v){
  return v instanceof this;
};

if(typeof N3D !== "undefined"){
  N3D.Vector2 = Vector2;
}

function Vector3(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
  
  return this;
};
Vector3.prototype = {
  constructor:Vector3,
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    
    return this;
  },
  scale:function(v){
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    
    return this;
  },
  multiplyNumber:function(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
    
    return this;
  },
  cross:function(v){
    var x = this.x,y = this.y,z = this.z;
    
    this.x = y*v.z - z*v.y;
    this.y = z*v.x - x*v.z;
    this.z = x*v.y - y*v.x;
    
    return this;
  },
  dot:function(){
    var x = this.x,y = this.y,z = this.z;
    return (x*x + y*y + z*z);
  },
  length:function(){
    var x = this.x,y = this.y,z = this.z;
    return Math.sqrt(x*x + y*y + z*z);
  },
  normalize:function(){
    var x = this.x,y = this.y,z = this.z;
    var length = Math.sqrt(x*x + y*y + z*z);
    
    this.x /= length;
    this.y /= length;
    this.z /= length;
    
    return this; 
  },
  negative:function(){
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  },
  toString:function(){
    return "N3D.Vector3("+this.x+","+this.y+","+this.z+")";
  }
};

Vector3.Up = new Vector3(0,1,0);
Vector3.Right = new Vector3(1,0,0);
Vector3.Forward = new Vector3(0,0,1);
Vector3.Zero = new Vector3(0,0,0);

Vector3.Lerp = function(v1,v2,a){
  return new this(
    MathHelper.Lerp(v1.x, v2.x, a),
    MathHelper.Lerp(v1.y, v2.y, a),
    MathHelper.Lerp(v1.z, v2.z, a)
  );
};
Vector3.Max = function(v1,v2){
  return new this(
    MathHelper.Max(v1.x, v2.x),
    MathHelper.Max(v1.y, v2.y),
    MathHelper.Max(v1.z, v2.z)
  );
};
Vector3.Min = function(v1,v2){
  return new this(
    MathHelper.Min(v1.x, v2.x),
    MathHelper.Min(v1.y, v2.y),
    MathHelper.Min(v1.z, v2.z)
  );
};
Vector3.Herminte = function(v1,t1,v2,t2,a){
  return new this(
    MathHelper.Hermite(v1.x, t1.x, v2.x, t2.x, a),
    MathHelper.Hermite(v1.y, t1.y, v2.y, t2.y, a),
    MathHelper.Hermite(v1.z, t1.z, v2.z, t2.z, a)
  );   
};
Vector3.isZero = function(v){
  if(v.x==v.y==v.z==0){
    return true;
  }
  return false;
};
Vector3.Equals = function(v){
  return v instanceof this;
};
Vector3.DistanceSquared = function(v1,v2){
  return (v1.x-v2.x) * (v1.x-v2.x) + (v1.y-v2.y) * (v1.y-v2.y) + (v1.z-v2.z) * (v1.z-v2.z); 
};
Vector3.Distance = function(v1,v2){
  return Math.sqrt(this.DistanceSquared(v1,v2));
};
Vector3.Cross = function(v1, v2){
  return new this(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x  
  );
};
Vector3.BaryCentric = function(v1,v2,v3,a1,a2,r){
  return new this(
    MathHelper.Barycentric(v1.x, v2.x, v3.x, a1, a2),
    MathHelper.Barycentric(v1.y, v2.y, v3.y, a1, a2),
    MathHelper.Barycentric(v1.z, v2.z, v3.z, a1, a2)
  );
};

Vector3.CatmullRom = function(v1,v2,v3,v4,a,r){
  return new this(
    MathHelper.CatmullRom(v1.x, v2.x, v3.x, v4.x, a),
    MathHelper.CatmullRom(v1.y, v2.y, v3.y, v4.y, a),
    MathHelper.CatmullRom(v1.z, v2.z, v3.z, v4.z, a)
  );
};

Vector3.Clamp = function(v1, min, max){
  return new this(
    MathHelper.Clamp(v1.x, min.x, max.x),
    MathHelper.Clamp(v1.y, min.y, max.y),
    MathHelper.Clamp(v1.z, min.z, max.z)
  );
};
Vector3.Dot = function(v1, v2){
  return (v1.x*v2.x + v1.y*v2.y + v1.z * v2.z);
};
Vector3.Reflect = function(v,n){
  var dT = 2 * this.Dot(v,n);
  return new N3D.Vector3(
    v.x - dT * n.x,
    v.y - dT * n.y,
    v.z - dT * n.z
  );
};


Vector3.SmoothStep = function(v1,v2,a){
  return new this(
    MathHelper.SmoothStep(v1.x, v2.x, a),
    MathHelper.SmoothStep(v1.y, v2.y, a),
    MathHelper.SmoothStep(v1.z, v2.z, a)
  );
};

if(typeof N3D !== "undefined"){
  N3D.Vector3 = Vector3;
}

function Vector4(x,y,z,w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
   
  return this;
};
Vector4.prototype = {
  constructor:Vector4,
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w -= v.w;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    
    return this;
  },
  multiply:function(v){
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    this.w *= v.w;
    
    return this;
  },
  divide:function(v){
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    
    return this;
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w);
  },
  normalize:function(){
    return Math.sqrt(this.dot());
  },
  projection:function(width,height){
    var width = width || Game.viewport.width;
    var height = height || Game.viewport.height;
  },
  toString:function(){
    return "N3D.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";
  }
};

Vector4.Equals = function(v){
  return v instanceof this;
};
Vector4.Projection = function(obj,viewport){
  var viewport = viewport || Game.viewport;
  
  if(-1 <= obj[0] <= 1 && -1 <= obj[1] <= 1 && -1 <= obj[2] <= 1){
    var x = (obj[0]+1)*(viewport.width*0.5); 
    var y = (obj[1]+1)*(viewport.height*0.5);
    return new Vector2(x ^ 0,y ^ 0);
  }
  
  return false;
};

if(typeof N3D !== "undefined"){
  N3D.Vector4 = Vector4;
}

function Matrix4a(n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15){
  if(n15 !== undefined){
    this.m = ([n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15]);

    return this;
  }else{
    this.m = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]; 
  }
  return this;
};
Matrix4a.prototype = {
  constructor:Matrix4a,
  type:"Array",
  determinant:function(){
    var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3],
        m4 = this.m[4], m5 = this.m[5], m6 = this.m[6], m7 = this.m[7],
        m8 = this.m[8], m9 = this.m[9], m10 = this.m[10], m11 = this.m[11],
        m12 = this.m[12], m13 = this.m[13], m14 = this.m[14], m15 = this.m[15];
        n0 = m5*(m10*m15-m11*m14 - m6*(m9*m15-m11*m13) + m7*(m9*m14-m10*m13)),
        n4 = m4*(m10*m15-m11*m14) - m6*(m8*m15-m11*m12) + m7*(m8*m14-m10*m12),
        n8 = m4*(m9*m15-m11*m13) - m5*(m8*m15-m11*m12) + m7*(m8*m13-m9*m12),
        n12 = m4*(m9*m14-m10*m13) - m5*(m8*m14-m10*m12) + m6*(m8*m13-m9*m12)

    return (m0*n0 + m1*n4 - m2*n8 + m3*n12);
  },
  inverse:function(){
    var m = this.m, 
        m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
        m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
        m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11],
        m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15],
        n0 = m5*(m10*m15-m11*m14 - m6*(m9*m15-m11*m13) + m7*(m9*m14-m10*m13)),
        n4 = m4*(m10*m15-m11*m14) - m6*(m8*m15-m11*m12) + m7*(m8*m14-m10*m12),
        n8 = m4*(m9*m15-m11*m13) - m5*(m8*m15-m11*m12) + m7*(m8*m13-m9*m12),
        n12 = m4*(m9*m14-m10*m13) - m5*(m8*m14-m10*m12) + m6*(m8*m13-m9*m12),
        det = 1/(m0*n0 + m1*n4 - m2*n8 + m3*n12);
    
    m[0] = n0*det;
    m[1] = -(m1*(m10*m15-m11*m14) - m2*(m9*m15-m11*m13) + m3*(m9*m14-m10*m13))*det;
    m[2] = (m1*(m6*m15-m7*m14) - m2*(m5*m15-m7*m13) + m3*(m5*m14-m6*m13))*det;
    m[3] = -(m1*(m6*m11-m7*m10) - m2*(m5*m11-m7*m9) + m3*(m5*m10-m6*m9))*det;
    m[4] = -n4*det;
    m[5] = (m0*(m10*m15-m11*m14) - m2*(m8*m15-m11*m12) + m3*(m8*m14-m10*m12))*det;
    m[6] = -(m0*(m6*m15-m7*m14) - m2*(m4*m15-m7*m12) + m3*(m4*m14-m6*m12))*det;
    m[7] = (m0*(m6*m11-m7*m10) - m2*(m4*m11-m7*m8) + m3*(m4*m10-m6*m8))*det;
    m[8] = n8*det;
    m[9] = -(m0*(m9*m15-m11*m13) - m1*(m8*m15-m11*m12) + m3*(m8*m13-m9*m12))*det;
    m[10] = (m0*(m5*m15-m7*m13) - m1*(m4*m15-m7*m12) + m3*(m4*m13-m5*m12))*det;
    m[11] = -(m0*(m5*m11-m7*m9) - m1*(m4*m11-m7*m8) + m3*(m4*m9-m5*m8))*det;
    m[12] = -n12*det;
    m[13] = (m0*(m9*m14-m10*m13) - m1*(m8*m14-m10*m12) + m2*(m8*m13-m9*m12))*det;
    m[14] = -(m0*(m5*m14-m6*m13) - m1*(m4*m14-m6*m12) + m2*(m4*m13-m5*m12))*det;
    m[15] = (m0*(m5*m10-m6*m9) - m1*(m4*m10-m6*m8) + m2*(m4*m9-m5*m8))*det;

    return this;
  },
  multiply:function(n){
    var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3],
    m4 = this.m[4], m5 = this.m[5], m6 = this.m[6], m7 = this.m[7],
    m8 = this.m[8], m9 = this.m[9], m10 = this.m[10], m11 = this.m[11],
    m12 = this.m[12], m13 = this.m[13], m14 = this.m[14], m15 = this.m[15],
    n0 = n.m[0], n1 = n.m[1], n2 = n.m[2], n3 = n.m[3],
    n4 = n.m[4], n5 = n.m[5], n6 = n.m[6], n7 = n.m[7],
    n8 = n.m[8], n9 = n.m[9], n10 = n.m[10], n11 = n.m[11],
    n12 = n.m[12], n13 = n.m[13], n14 = n.m[14], n15 = n.m[15];
        
    this.m = ([
      m0*n0 + m1*n4 + m2*n8 + m3*n12,
      m0*n1 + m1*n5 + m2*n9 + m3*n13,
      m0*n2 + m1*n6 + m2*n10 + m3*n14,
      m0*n3 + m1*n7 + m2*n11 + m3*n15,
      
      m4*n0 + m5*n4 + m6*n8 + m7*n12,
      m4*n1 + m5*n5 + m6*n9 + m7*n13,
      m4*n2 + m5*n6 + m6*n10 + m7*n14,
      m4*n3 + m5*n7 + m6*n11 + m7*n15,
      
      m8*n0 + m9*n4 + m10*n8 + m11*n12,
      m8*n1 + m9*n5 + m10*n9 + m11*n13,
      m8*n2 + m9*n6 + m10*n10 + m11*n14,
      m8*n3 + m9*n7 + m10*n11 + m11*n15,
      
      m12*n0 + m13*n4 + m14*n8 + m15*n12,
      m12*n1 + m13*n5 + m14*n9 + m15*n13,
      m12*n2 + m13*n6 + m14*n10 + m15*n14,
      m12*n3 + m13*n7 + m14*n11 + m15*n15      
    ]);
  },
  multiplyVector4:function(v){
    var m = this.m;
    var x = v.x, y = v.y, z = v.z;
    return new Vector4(
      m[0] * x + m[1] * y + m[2] * z + m[3] * v.w,
      m[4] * x + m[5] * y + m[6] * z + m[7] * v.w,
      m[8] * x + m[9] * y + m[10] * z + m[11] * v.w,
      m[12] * x + m[13] * y + m[14] * z + m[15] * v.w  
    );
  },
  toString:function(){
    var m = this.m;
    return m[0].toFixed(4)+", "+m[1].toFixed(4)+", "+m[2].toFixed(4)+", "+m[3].toFixed(4) + "\n" +
           m[4].toFixed(4)+", "+m[5].toFixed(4)+", "+m[6].toFixed(4)+", "+m[7].toFixed(4) + "\n" + 
           m[8].toFixed(4)+", "+m[9].toFixed(4)+", "+m[10].toFixed(4)+", "+m[11].toFixed(4) + "\n" + 
           m[12].toFixed(4)+", "+m[13].toFixed(4)+", "+m[14].toFixed(4)+", "+m[15].toFixed(4); 
  }
};

function Matrix4o(n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15){
  if(n15){
    this.m0 = n0; this.m1 = n1; this.m2 = n2; this.m3 = n3;
    this.m4 = n4; this.m5 = n5; this.m6 = n6; this.m7 = n7;
    this.m8 = n8; this.m9 = n9; this.m10 = n10; this.m11 = n11;
    this.m12 = n12; this.m13 = n13; this.m14 = n14; this.m15 = n15;
    
    return this;
  }
  this.m0 = 1; this.m1 = 0; this.m2 = 0; this.m3 = 0;
  this.m4 = 0; this.m5 = 1; this.m6 = 0; this.m7 = 0;
  this.m8 = 0; this.m9 = 0; this.m10 = 1; this.m11 = 0;
  this.m12 = 0; this.m13 = 0; this.m14 = 0; this.m15 = 1;
  
  return this;
};
Matrix4o.prototype = {
  type:"Object",
  determinant:function(){
    var m0 = this.m0, m1 = this.m1, m2 = this.m2, m3 = this.m3,
        m4 = this.m4, m5 = this.m5, m6 = this.m6, m7 = this.m7,
        m8 = this.m8, m9 = this.m9, m10 = this.m10, m11 = this.m11,
        m12 = this.m12, m13 = this.m13, m14 = this.m14, m15 = this.m15;
        n0 = m5*(m10*m15-m11*m14 - m6*(m9*m15-m11*m13) + m7*(m9*m14-m10*m13)),
        n4 = m4*(m10*m15-m11*m14) - m6*(m8*m15-m11*m12) + m7*(m8*m14-m10*m12),
        n8 = m4*(m9*m15-m11*m13) - m5*(m8*m15-m11*m12) + m7*(m8*m13-m9*m12),
        n12 = m4*(m9*m14-m10*m13) - m5*(m8*m14-m10*m12) + m6*(m8*m13-m9*m12)

    return (m0*n0 + m1*n4 - m2*n8 + m3*n12);
  },
  inverse:function(){
    var m0 = this.m0, m1 = this.m1, m2 = this.m2, m3 = this.m3,
        m4 = this.m4, m5 = this.m5, m6 = this.m6, m7 = this.m7,
        m8 = this.m8, m9 = this.m9, m10 = this.m10, m11 = this.m11,
        m12 = this.m12, m13 = this.m13, m14 = this.m14, m15 = this.m15,
        n0 = m5*(m10*m15-m11*m14 - m6*(m9*m15-m11*m13) + m7*(m9*m14-m10*m13)),
        n4 = m4*(m10*m15-m11*m14) - m6*(m8*m15-m11*m12) + m7*(m8*m14-m10*m12),
        n8 = m4*(m9*m15-m11*m13) - m5*(m8*m15-m11*m12) + m7*(m8*m13-m9*m12),
        n12 = m4*(m9*m14-m10*m13) - m5*(m8*m14-m10*m12) + m6*(m8*m13-m9*m12),
        det = 1/(m0*n0 + m1*n4 - m2*n8 + m3*n12);
    
    this.m0 = n0*det;
    this.m1 =  -(m1*(m10*m15-m11*m14) - m2*(m9*m15-m11*m13) + m3*(m9*m14-m10*m13))*det;
    this.m2 = (m1*(m6*m15-m7*m14) - m2*(m5*m15-m7*m13) + m3*(m5*m14-m6*m13))*det;
    this.m3 = -(m1*(m6*m11-m7*m10) - m2*(m5*m11-m7*m9) + m3*(m5*m10-m6*m9))*det;
    this.m4 = -n4*det;
    this.m5 = (m0*(m10*m15-m11*m14) - m2*(m8*m15-m11*m12) + m3*(m8*m14-m10*m12))*det;
    this.m6 = -(m0*(m6*m15-m7*m14) - m2*(m4*m15-m7*m12) + m3*(m4*m14-m6*m12))*det;
    this.m7 = (m0*(m6*m11-m7*m10) - m2*(m4*m11-m7*m8) + m3*(m4*m10-m6*m8))*det;
    this.m8 = n8*det;
    this.m9 = -(m0*(m9*m15-m11*m13) - m1*(m8*m15-m11*m12) + m3*(m8*m13-m9*m12))*det;
    this.m10 = (m0*(m5*m15-m7*m13) - m1*(m4*m15-m7*m12) + m3*(m4*m13-m5*m12))*det;
    this.m11 = -(m0*(m5*m11-m7*m9) - m1*(m4*m11-m7*m8) + m3*(m4*m9-m5*m8))*det;
    this.m12 = -n12*det;
    this.m13 = (m0*(m9*m14-m10*m13) - m1*(m8*m14-m10*m12) + m2*(m8*m13-m9*m12))*det;
    this.m14 = -(m0*(m5*m14-m6*m13) - m1*(m4*m14-m6*m12) + m2*(m4*m13-m5*m12))*det;
    this.m15 = (m0*(m5*m10-m6*m9) - m1*(m4*m10-m6*m8) + m2*(m4*m9-m5*m8))*det;

    return this;
  },
  multiply:function(n){
    var m0 = this.m0, m1 = this.m1, m2 = this.m2, m3 = this.m3,
    m4 = this.m4, m5 = this.m5, m6 = this.m6, m7 = this.m7,
    m8 = this.m8, m9 = this.m9, m10 = this.m10, m11 = this.m11,
    m12 = this.m12, m13 = this.m13, m14 = this.m14, m15 = this.m15,
    n0 = n.m0, n1 = n.m1, n2 = n.m2, n3 = n.m3,
    n4 = n.m4, n5 = n.m5, n6 = n.m6, n7 = n.m7,
    n8 = n.m8, n9 = n.m9, n10 = n.m10, n11 = n.m11,
    n12 = n.m12, n13 = n.m13, n14 = n.m14, n15 = n.m15;
        
    this.m0 = m0*n0 + m1*n4 + m2*n8 + m3*n12;
    this.m1 = m0*n1 + m1*n5 + m2*n9 + m3*n13;
    this.m2 = m0*n2 + m1*n6 + m2*n10 + m3*n14;
    this.m3 = m0*n3 + m1*n7 + m2*n11 + m3*n15;
    this.m4 = m4*n0 + m5*n4 + m6*n8 + m7*n12;
    this.m5 = m4*n1 + m5*n5 + m6*n9 + m7*n13;
    this.m6 = m4*n2 + m5*n6 + m6*n10 + m7*n14;
    this.m7 = m4*n3 + m5*n7 + m6*n11 + m7*n15;
    this.m8 = m8*n0 + m9*n4 + m10*n8 + m11*n12;
    this.m9 = m8*n1 + m9*n5 + m10*n9 + m11*n13;
    this.m10 = m8*n2 + m9*n6 + m10*n10 + m11*n14;
    this.m11 = m8*n3 + m9*n7 + m10*n11 + m11*n15;
    this.m12 = m12*n0 + m13*n4 + m14*n8 + m15*n12;
    this.m13 = m12*n1 + m13*n5 + m14*n9 + m15*n13;
    this.m14 = m12*n2 + m13*n6 + m14*n10 + m15*n14;
  },
  multiplyVector4:function(v){
    var x = v.x, y = v.y, z = v.z;
    return new Vector4(
      this.m0 * x + this.m1 * y + this.m2 * z + this.m3 * w,
      this.m4 * x + this.m5 * y + this.m6 * z + this.m7 * w,
      this.m8 * x + this.m9 * y + this.m10 * z + this.m11 * w,
      this.m12 * x + this.m13 * y + this.m14 * z + this.m15 * w  
    );
  },
  toString:function(){
    var m = this;
    return m.m0.toFixed(4)+", "+m.m1.toFixed(4)+", "+m.m2.toFixed(4)+", "+m.m3.toFixed(4) + "\n" +
           m.m4.toFixed(4)+", "+m.m5.toFixed(4)+", "+m.m6.toFixed(4)+", "+m.m7.toFixed(4) + "\n" + 
           m.m8.toFixed(4)+", "+m.m9.toFixed(4)+", "+m.m10.toFixed(4)+", "+m.m11.toFixed(4) + "\n" + 
           m.m12.toFixed(4)+", "+m.m13.toFixed(4)+", "+m.m14.toFixed(4)+", "+m.m15.toFixed(4); 
  }  
};




var Matrix4 = (window.chrome) ? Matrix4a : Matrix4o;

Matrix4.Identity = function(){
  return new this(
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1  
  );
};

Matrix4.CreateRotationX = function(angle){
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return new this(
    1,0,0,0,
    0,c,-s,0,
    0,s,c,0,
    0,0,0,1
  );
};

Matrix4.CreateRotationY = function(angle){
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return new this(
    c,0,s,0,
    0,1,0,0,
    -s,0,c,0,
    0,0,0,1
  );  
};

Matrix4.CreateRotationZ = function(angle){
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return new this(
    c,-s,0,0,
    s,c,0,0,
    0,0,1,0,
    0,0,0,1
  );   
};
Matrix4.CreateTranslation = function(x,y,z){
  return new this(
    1,0,0,x,
    0,1,0,y,
    0,0,1,z,
    0,0,0,1
  );   
};
Matrix4.CreateScale = function(x,y,z){
  return new this(
    x,0,0,0,
    0,y,0,0,
    0,0,z,0,
    0,0,0,1
  );   
};

Matrix4.CreateRotationAroundAxis = function(angle,v){
  var c = Math.cos(angle);    // cosine
      s = Math.sin(angle);    // sine
      x = v.x, y = v.y, z = v.z,
      xx = x * x,
      xy = x * y,
      xz = x * z,
      yy = y * y,
      yz = y * z,
      zz = z * z,
      t = 1 - c;

  return new this(
    xx * t + c, xy * t - z * s, xz * t + y * s, 0,  
    xy * t + z * s, yy * t + c, yz * t - x * s, 0,
    xz * t - y * s, yz * t + x * s, zz * t + c, 0,
    0,0,0,1
  );

};

Matrix4.CreateFrustum = function(l,r,b,t,n,f){
  var a = 2*n/(r-l),
      b = (r+l)/(r-l),
      c = 2*n/(t-b),
      d = (t+b)*(t-b),
      e = -(f+n) / (f-n),
      f = -2*f*n/(f-n);

  return new this(
    a,0,b,0,
    0,c,d,0,
    0,0,e,f,
    0,0,-1,0
  );
};

Matrix4.CreatePerspectiveProjection = function(fov,aspect,near,far){
  var t = Math.tan(fov*0.5 * Math.PI/180);
  var h = near*t;
  var w = near*aspect;
  
  return Matrix4.CreateFrustum(-w,w,-h,h,near,far);
};

Matrix4.CreateOrthographicProjection = function(l,r,b,t,n,f){
  var a = 2/(r-l),
      b = -((r+l)/(r-l)),
      c = 2/(t-b),
      d = -((t+b)/(t-b)),
      e = -2/(f-n),
      f = -((f+n)/(f-n));
      
  return new this(
    a,0,0,b,
    0,c,0,d,
    0,0,e,f,
    0,0,0,1
  );
};

if(typeof N3D !== "undefined"){
  N3D.Matrix4 = Matrix4;
}

var Maths = {
  Log10E : 0.4342945,
  Log2E : 1.442695,
  PiOver2 : Math.PI*0.5,
  PiOver4 : Math.PI*0.25,
  TwoPi : Math.PI*2,
  PiOver360 : Math.PI/360,
  PiOver180 : Math.PI/180
}

Maths.cot = function(num){
  return 1/Math.tan(num);
};

Maths.Barycentric = function(v1,v2,v3,a1,a2){
  return v1 + (v2-v1) * a1 + (v3-v1) * a2;
};
Maths.CatmullRom = function(v1, v2, v3, v4, a){
  var aS = a * a;
  var aC = aS * a;
  return (0 * (2 * ve2 + (v3 - v1) * a + (2 * v1 - 5 * v2 + 4 * v3 - v4) * aS + (3 * v2 - v1 - 3 * v3 + v4) * aC));
};
Maths.Clamp = function(v,min,max){
  return v > max ? max : (v < min ? min : v);
};
Maths.Lerp = function(v1,v2,a){
  return v1 + (v2-v1) * a;
};
Maths.Lerp2 = function(a1,a2,b1,b2,a){
  var a = (a-a1)/(a2-a1);  
  return (b1 + a*(b2-b1)); 
};
Maths.SmoothStep = function(v1,v2,a){
  return MathHelper.Hermite(v1,v2,MathHelper.Clamp(a,0,1));
};
Maths.ToDegrees = function(d){
  return d * 180/Math.PI;
};
Maths.ToRadians = function(d){
  return d * Math.PI/180;
};
Maths.IEEERemainder = function(f1,f2){
  return f1 - (f2 * Math.round(f1/f2));
};
Maths.WrapAngle = function(){
  var angle = MathHelper(angle,MathHelper.TwoPi);
  
  if(angle<=-Math.PI){
    angle += MathHelper.TwoPi;
    return angle;
  }
  if(angle > Math.PI){
    angle -= MathHelper.TwoPi;
  } 
  return angle;
};

if(typeof N3D !== "undefined"){
  N3D.Math = Maths;
}