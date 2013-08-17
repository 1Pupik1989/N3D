N3D.isLoaded = true;

var $M3 = N3D.Math.Matrix3 = function(n0,n1,n2,n3,n4,n5,n6,n7,n8){
  this.m = [n0,n1,n2,n3,n4,n5,n6,n7,n8];

  return this;
};
N3D.Math.Matrix3.prototype = {
  constructor:N3D.Math.Matrix3,
  identity:function(){
    this.m = [
      1,0,0,
      0,1,0,
      0,0,1
    ]; 
    return this; 
  },
  determinant:function(){
  },
  inverse:function(){
    var m = this.m,
        m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
        m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
        m8 = m[8],
        a0 = (m8*m4-m7*m5),
        a1 = (m8*m1-m7*m2),
        a2 = (m5*m1-m4*m2);
    
    var det = 1/(m0*a0-m3*a1+m6*a2);
    
    m[0] =  a0*det;
    m[1] = -a1*det;
    m[2] =  a2*det;
    
    m[3] = -(m8*m3-m6*m5)*det;
    m[4] =  (m8*m0-m6*m2)*det;
    m[5] = -(m5*m0-m3*m2)*det;
    
    m[6] =  (m7*m3-m6*m4)*det;
    m[7] = -(m7*m0-m6*m1)*det;
    m[8] =  (m4*m0-m3*m1)*det; 

    return this;
  },
  multiply:function(n){
    var m = this.m,
        nm = n.m, 
        m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
        m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
        m8 = m[8],

        n0 = nm[0], n1 = nm[1], n2 = nm[2], n3 = nm[3],
        n4 = nm[4], n5 = nm[5], n6 = nm[6], n7 = nm[7],
        n8 = nm[8];
        
        
    m[0] = m0*n0 + m1*n3 + m2*n6;
    m[1] = m0*n1 + m1*n4 + m2*n7;
    m[2] = m0*n2 + m1*n5 + m2*n8;
      
    m[3] = m3*n0 + m4*n3 + m5*n6;
    m[4] = m3*n1 + m4*n4 + m5*n7;
    m[5] = m3*n2 + m4*n5 + m5*n8;  
    
    m[6] = m6*n0 + m7*n3 + m8*n6;
    m[7] = m6*n1 + m7*n4 + m8*n7;
    m[8] = m6*n2 + m7*n5 + m8*n8; 
      
   return this;
  },
  multiplyVector3:function(v){
    var m = this.m;
    var x = v.x, y = v.y, z = v.z;

    return new $V3(
      m[0] * x + m[3] * y + m[6] * z,
      m[1] * x + m[4] * y + m[7] * z,
      m[2] * x + m[5] * y + m[8] * z
    );
  },
  transpose:function(){
    var m = this.m;
    var a1 = m[1], a2 = m[2], a5 = m[3];
                
    m[1] = m[3];
    m[2] = m[6];
    m[5] = m[7];
    
    m[3] = a1;
    m[6] = a2;
    m[7] = a5;
    
    return this;    
  },
  scale:function(x,y,z){
    var m = this.m;
    m[0] *= x; m[1] *= y; m[2] *= z;
		m[3] *= x; m[4] *= y; m[5] *= z;
		m[6] *= x; m[7] *= y; m[8] *= z;
    
    return this;
  },
  rotateX: function(angle){
    var m = this.m;
    
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    
    var m1 = m[1], m4 = m[4], m7 = m[7],
        m2 = m[2], m5 = m[5], m8= m[8];

    m[1] = m1 * c + m2 *s;
    m[4] = m4 * c + m5 *s;
    m[7] = m7 * c + m8*s;

    m[2] = m1 * -s + m2 * c;
    m[6] = m4 * -s + m5 * c;
    m[10]= m7 * -s + m8* c;

    return this;
  },
  rotateY: function(angle){
    var m = this.m;
    
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var m0 = m[0], m3 = m[3], m6 = m[6],
        m2 = m[2], m5 = m[5], m8= m[8];
    
    m[0] = m0 * c + m2 * -s;
    m[3] = m3 * c + m5 * -s;
    m[6] = m6 * c + m8* -s;

    m[2] = m0 *s + m2 * c;
    m[5] = m3 *s + m5 * c;
    m[8] = m6 *s + m8* c;

    return this;
  },
  rotateZ:function(angle){
    var m = this.m;
    
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var m0 = m[0], m3 = m[3], m6 = m[6],
        m1 = m[1], m4 = m[4], m7 = m[7];

    m[0] = m0 * c + m1 *s;
    m[3] = m3 * c + m4 *s;
    m[6] = m6 * c + m7 *s;

    m[1] = m0 * -s + m1 * c;
    m[4] = m3 * -s + m4 * c;
    m[7] = m6 * -s + m7 * c; 

    return this;
  },
  toString:function(){
    var m = this.m;
    return m[0].toFixed(4)+", "+m[1].toFixed(4)+", "+m[2].toFixed(4) + "\n" +
           m[3].toFixed(4)+", "+m[4].toFixed(4)+", "+m[5].toFixed(4) + "\n" + 
           m[6].toFixed(4)+", "+m[7].toFixed(4)+", "+m[8].toFixed(4) + "\n"; 
  }
};
N3D.Math.Matrix3.Identity = function(){
  return new this(1,0,0,0,1,0,0,0,1);
};

N3D.Math.Matrix3.FromMatrix4 = function(m){
  var m = m.m;
  
  return new this(
    m[0], m[1], m[2],
    m[4], m[5], m[6],
    m[8], m[9], m[10]
  );
};

N3D.Math.Matrix3.Inverse = function(m){
  var m = this.m,
        m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
        m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
        m8 = m[8],
        a0 = (m8*m4-m7*m5),
        a1 = (m8*m1-m7*m2),
        a2 = (m5*m1-m4*m2);
    
    var det = 1/(m0*a0-m3*a1+m6*a2);
    
    return new this(
        a0*det,           -a1*det,              a2*det,
      -(m8*m3-m6*m5)*det,  (m8*m0-m6*m2)*det, -(m5*m0-m3*m2)*det,
       (m7*m3-m6*m4)*det, -(m7*m0-m6*m1)*det,  (m4*m0-m3*m1)*det 
    );

    return this;
};