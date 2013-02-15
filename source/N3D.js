var N3D = {};
N3D.Matrix4 = function(n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15){
  if(arguments.length == 16){
    this.set(n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15);
  }else{
    this.identity();
  }
};
N3D.Matrix4.prototype = {
  constructor:N3D.Matrix4,
  identity:function(){ //identická matice
    this.m = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ];
    return this;
  },
  set:function(n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15){
    this.m = [n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15];
    return this;
  },
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
    var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3],
        m4 = this.m[4], m5 = this.m[5], m6 = this.m[6], m7 = this.m[7],
        m8 = this.m[8], m9 = this.m[9], m10 = this.m[10], m11 = this.m[11],
        m12 = this.m[12], m13 = this.m[13], m14 = this.m[14], m15 = this.m[15],
        n0,n4,n8,n12;
    
    n0 = m5*(m10*m15-m11*m14 - m6*(m9*m15-m11*m13) + m7*(m9*m14-m10*m13));
    n4 = m4*(m10*m15-m11*m14) - m6*(m8*m15-m11*m12) + m7*(m8*m14-m10*m12);
    n8 = m4*(m9*m15-m11*m13) - m5*(m8*m15-m11*m12) + m7*(m8*m13-m9*m12);
    n12 = m4*(m9*m14-m10*m13) - m5*(m8*m14-m10*m12) + m6*(m8*m13-m9*m12);

    var det = m0*n0 + m1*n4 - m2*n8 + m3*n12;
    
    if(det == 0){ return false; }
    det = 1/det;
    
    this.m = [
      n0*det,
      -(m1*(m10*m15-m11*m14) - m2*(m9*m15-m11*m13) + m3*(m9*m14-m10*m13))*det,
      (m1*(m6*m15-m7*m14) - m2*(m5*m15-m7*m13) + m3*(m5*m14-m6*m13))*det,
      -(m1*(m6*m11-m7*m10) - m2*(m5*m11-m7*m9) + m3*(m5*m10-m6*m9))*det,
      -n4*det,
      (m0*(m10*m15-m11*m14) - m2*(m8*m15-m11*m12) + m3*(m8*m14-m10*m12))*det,
      -(m0*(m6*m15-m7*m14) - m2*(m4*m15-m7*m12) + m3*(m4*m14-m6*m12))*det,
      (m0*(m6*m11-m7*m10) - m2*(m4*m11-m7*m8) + m3*(m4*m10-m6*m8))*det,
      n8*det,
      -(m0*(m9*m15-m11*m13) - m1*(m8*m15-m11*m12) + m3*(m8*m13-m9*m12))*det,
      (m0*(m5*m15-m7*m13) - m1*(m4*m15-m7*m12) + m3*(m4*m13-m5*m12))*det,
      -(m0*(m5*m11-m7*m9) - m1*(m4*m11-m7*m8) + m3*(m4*m9-m5*m8))*det,
      -n12*det,
      (m0*(m9*m14-m10*m13) - m1*(m8*m14-m10*m12) + m2*(m8*m13-m9*m12))*det,
      -(m0*(m5*m14-m6*m13) - m1*(m4*m14-m6*m12) + m2*(m4*m13-m5*m12))*det,
      (m0*(m5*m10-m6*m9) - m1*(m4*m10-m6*m8) + m2*(m4*m9-m5*m8))*det
    ];

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
        
    this.m = [
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
    ];
  },
  multiplyVector4:function(v){
    var m = this.m;
    return new N3D.Vector4(
      m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3] * v.w,
      m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7] * v.w,
      m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11] * v.w,
      m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15] * v.w  
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

N3D.Matrix4.Multiply = function(m,n){
  var m0 = m.m[0], m1 = m.m[1], m2 = m.m[2], m3 = m.m[3],
      m4 = m.m[4], m5 = m.m[5], m6 = m.m[6], m7 = m.m[7],
      m8 = m.m[8], m9 = m.m[9], m10 = m.m[10], m11 = m.m[11],
      m12 = m.m[12], m13 = m.m[13], m14 = m.m[14], m15 = m.m[15];
      
  var n0 = n.m[0], n1 = n.m[1], n2 = n.m[2], n3 = n.m[3],
      n4 = n.m[4], n5 = n.m[5], n6 = n.m[6], n7 = n.m[7],
      n8 = n.m[8], n9 = n.m[9], n10 = n.m[10], n11 = n.m[11],
      n12 = n.m[12], n13 = n.m[13], n14 = n.m[14], n15 = n.m[15];
      
  return new N3D.Matrix4(
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
  );
};


N3D.Vector3 = function(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
   
  return this;
};
N3D.Vector3.prototype = {
  constructor:N3D.Vector3,
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
  multiply:function(v){
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    
    return this;
  },
  divide:function(v){
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    
    return this;
  },
  dot:function(v){
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  normalize:function(){
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  },
  toString:function(){
    return "N3D.Vector3("+this.x+","+this.y+","+this.z+")";
  } 
};

N3D.Vector4 = function(x,y,z,w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
   
  return this;
};
N3D.Vector4.prototype = {
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
  toString:function(){
    return "N3D.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";
  }
};