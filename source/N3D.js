var N3D = {};
N3D.Matrix4 = function(){
  if(arguments.length == 16){
    this.set.apply(this,arguments);
  }else{
    this.identity();
  }
};
N3D.Matrix4.prototype = {
  constructor:N3D.Matrix4,
  identity:function(){ //identická matice
    return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
  },
  set:function(m0,m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15){ //nastavení polí
    this.m = [
      m0,m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15
    ];
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

    return m0*n0 + m1*n4 - m2*n8 + m3*n12;
  },
  inverse:function(){
    var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3],
        m4 = this.m[4], m5 = this.m[5], m6 = this.m[6], m7 = this.m[7],
        m8 = this.m[8], m9 = this.m[9], m10 = this.m[10], m11 = this.m[11],
        m12 = this.m[12], m13 = this.m[13], m14 = this.m[14], m15 = this.m[15];
        
    var n0,n4,n8,n12;
    
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
  toString:function(){
    var m = this.m;
    return m[0].toFixed(4)+", "+m[1].toFixed(4)+", "+m[2].toFixed(4)+", "+m[3].toFixed(4) + "\n" +
           m[4].toFixed(4)+", "+m[5].toFixed(4)+", "+m[6].toFixed(4)+", "+m[7].toFixed(4) + "\n" + 
           m[8].toFixed(4)+", "+m[9].toFixed(4)+", "+m[10].toFixed(4)+", "+m[11].toFixed(4) + "\n" + 
           m[12].toFixed(4)+", "+m[13].toFixed(4)+", "+m[14].toFixed(4)+", "+m[15].toFixed(4); 
  }
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

/*

 */