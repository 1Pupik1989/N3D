/* >>>> Math.Main >>>> */
N3D.Math = (function(){
  var obj = {};
  var PI = Math.PI, floor = Math.floor, random = Math.random, sqrt = Math.sqrt;
  var PI180 = PI/180, PI180_rev = 180/PI, sqrt2 = sqrt(2), sqrt5 = sqrt(5);
  
  obj.Log10E = Math.LOG10E || 0.4342945;
  obj.Log2E = Math.LOG2E || 1.442695;
  obj.PiOver2 = PI*0.5;
  obj.PiOver4 = PI*0.25;
  obj.TwoPi = PI*2;
  obj.PiOver360 = PI/360;
  obj.PiOver180 = PI180;

  obj.RandomInt = function(min, max) {
    return floor(min + (random() * (max - min + 1)));
  };
  obj.RandomFloat = function(min, max) {
    return min + (random() * (max - min));
  };
  obj.AbsInt = function(n){
    var b = n >> 31; 
    return (n ^ b) - b;
  };
  
  obj.Radians2Degrees = function(d){
    return d * PI180_rev;
  };
  obj.Degrees2Radians = function(d){
    return d * PI180;
  };
  
  obj.FromFibonacci = function(T){
    var phi = (1 + root5) / 2;

    var idx  = floor( Math.log(T*sqrt5) / Math.log(phi) + 0.5 );
    var u = floor( Math.pow(phi, idx)/sqrt5 + 0.5);

    return (u == T) ? idx : false;
  };
  
  obj.ToFibonacci = function(n){
    return ~~(Math.pow( (1 + sqrt5) * 0.5,n) / sqrt5 +0.5);
  };
  
  return obj;
})();
/* <<<< Math.Main <<<< */

/* >>>> Matrix 2x2 >>>> */
N3D.Math.Matrix2 = function(a00,a02,
                            a01,a03){

  this.elements =  [
    a00,a01,
    a02,a03
  ];
  
  return this;                          
};

N3D.Math.Matrix2.prototype = {
  constructor:N3D.Math.Matrix3,
  identity:function(){
    this.elements = [1,0,0,
                     0,1,0,
                     0,0,1];
  },
  clone:function(){  
    var m = this.elements;
    return new this.constructor(
      m[0], m[3], m[6],
      m[1], m[4], m[7],
      m[2], m[5], m[8]
    );
  },
  inverse:function(){
    var m1 = this.elements,
     
        m1_00 = m1[0], m1_02 = m1[2], 
        m1_01 = m1[1], m1_03 = m1[3], 
        
        inv_det = (m1_00 * m1_03 - m1_01 * m1_02);
        
    if(inv_det === 0){ throw new Error('Determinant == 0'); }
    
    inv_det = 1/inv_det;  
    
    m1[0] =  m1_03 * inv_det;
    m1[1] = -m1_01 * inv_det;
    
    m1[2] = -m1_02 * inv_det;
    m1[3] =  m1_00 * inv_det;
    
    return this;  
  },
  multiply:function(m2){
    var m1 = this.elements,
        m2 = m2.elements, 
      
        m1_00 = m1[0], m1_02 = m1[2], 
        m1_01 = m1[1], m1_03 = m1[3],          
                                                   
        m2_00 = m2[0], m2_02 = m2[2],
        m2_01 = m2[1], m2_03 = m2[3]; 
        
    m1[0] = m1_00*m2_00 + m1_01*m2_02;
    m1[2] = m1_02*m2_00 + m1_03*m2_02;
    
    m1[1] = m1_00*m2_01 + m1_01*m2_03;
    m1[3] = m1_02*m2_01 + m1_03*m2_03;     
        
    return this;      
  },
  scale:function(x,y){
    var m = this.elements;
    
    m[0] *= x;  m[2] *= y;
    m[1] *= x;  m[3] *= y;
    
    return this;    
  },
  toString:function(){
    var m = this.elements;
    return '00: '+m[0].toFixed(3)+', 02: '+m[2].toFixed(3)+ '\n' + 
           '01: '+m[1].toFixed(3)+', 03: '+m[3].toFixed(3);

  }
};

N3D.Math.Matrix2.Identity = function(){
  return new N3D.Math.Matrix2(
    1,0,
    0,1
  );
};
/* <<<< Matrix 2x2 <<<< */

/* >>>> Matrix 3x3 >>>> */
N3D.Math.Matrix3 = function(a00,a03,a06,
                            a01,a04,a07,
                            a02,a05,a08){

  this.elements =  [
    a00,a01,a02,
    a03,a04,a05,
    a06,a07,a08
  ];
  
  return this;                          
};

N3D.Math.Matrix3.prototype = {
  constructor:N3D.Math.Matrix3,
  identity:function(){
    this.elements = [1,0,0,
                     0,1,0,
                     0,0,1];
  },
  clone:function(){  
    var m = this.elements;
    return new this.constructor(
      m[0], m[3], m[6],
      m[1], m[4], m[7],
      m[2], m[5], m[8]
    );
  },
  inverse:function(){ //zkontrolovat
    var m = this.elements, 
        m_00 = m[0],  m_03 = m[3],  m_06 = m[6],
        m_01 = m[1],  m_04 = m[4],  m_07 = m[7],
        m_02 = m[2],  m_05 = m[5],  m_08 = m[8];
        
    
    var n_00 = (m_04 * m_08 - m_05 * m_07),
        n_01 = (m_03 * m_08 - m_05 * m_06),
        n_02 = (m_03 * m_07 - m_04 * m_06),

        inv_det = (m_00 * n_00 - m_01 * n_01 + m_02 * n_02);
        
    if(inv_det === 0){ throw new Error('Determinant == 0'); }
    
    inv_det = 1/inv_det;     
    
    m[0] =  n_00 * inv_det;
    m[1] = -(m_01*m_08 - m_02*m_07) * inv_det;
    m[2] =  (m_01*m_05 - m_02*m_04) * inv_det;
    
    m[3] = -n_01 * inv_det;
    m[4] =  (m_00*m_08 - m_02*m_06) * inv_det;
    m[5] = -(m_00*m_05 - m_02*m_03) * inv_det;
    
    m[6] =  n_02 * inv_det;
    m[7] = -(m_00*m_07 - m_01*m_06) * inv_det;
    m[8] =  (m_00*m_04 - m_01*m_03) * inv_det;
    
    
    return this;
  },
  multiply:function(m2){
    var m1 = this.elements,
        m2 = m2.elements, 
      
        m1_00 = m1[0],  m1_03 = m1[3],  m1_06 = m1[6],
        m1_01 = m1[1],  m1_04 = m1[4],  m1_07 = m1[7],
        m1_02 = m1[2],  m1_05 = m1[5],  m1_08 = m1[8], 
                                                   
        m2_00 = m2[0],  m2_03 = m2[3],  m2_06 = m2[6],
        m2_01 = m2[1],  m2_04 = m2[4],  m2_07 = m2[7],
        m2_02 = m2[2],  m2_05 = m2[5],  m2_08 = m2[8];
    
      
    m1[0] = m1_00*m2_00 + m1_01*m2_03 + m1_02*m2_06;
    m1[3] = m1_03*m2_00 + m1_04*m2_03 + m1_05*m2_06;
    m1[6] = m1_06*m2_00 + m1_07*m2_03 + m1_08*m2_06; 
    
    m1[1] = m1_00*m2_01 + m1_01*m2_04 + m1_02*m2_07;
    m1[4] = m1_03*m2_01 + m1_04*m2_04 + m1_05*m2_07;
    m1[7] = m1_06*m2_01 + m1_07*m2_04 + m1_08*m2_07; 
    
    m1[2] = m1_00*m2_02 + m1_01*m2_05 + m1_02*m2_08;
    m1[5] = m1_03*m2_02 + m1_04*m2_05 + m1_05*m2_08;
    m1[8] = m1_06*m2_02 + m1_07*m2_05 + m1_08*m2_08; 

    return this;
  },
  scale:function(x,y,z){
    var m = this.elements;
    
    m[0] *= x;  m[3] *= y;  m[6] *= z;         
    m[1] *= x;  m[4] *= y;  m[7] *= z;
    m[2] *= x;  m[5] *= y;  m[8] *= z;
    
    return this;
  },
  transpose:function(){
    var m = this.elements;

    var tmp = m[1]; 
    m[1] = m[3]; m[3] = tmp; 

    tmp = m[2]; 
    m[2] = m[6]; m[6] = tmp;
    
    tmp = m[5]; 
    m[5] = m[7]; m[7] = tmp;
    
    return this;
  },
  toString:function(){
    var m = this.elements;
    return '00: '+m[0].toFixed(3)+', 03: '+m[3].toFixed(3)+', 06: '+m[6].toFixed(3)+ '\n' + 
           '01: '+m[1].toFixed(3)+', 04: '+m[4].toFixed(3)+', 07: '+m[7].toFixed(3)+ '\n' + 
           '02: '+m[2].toFixed(3)+', 05: '+m[5].toFixed(3)+', 08: '+m[8].toFixed(3);
  }
};

N3D.Math.Matrix3.Identity = function(){
  return new N3D.Math.Matrix3(
    1,0,0,
    0,1,0,
    0,0,1
  );
};
/* <<<< Matrix 3x3 <<<< */


/* >>>> Matrix 4x4 >>>> */
N3D.Math.Matrix4 = function(a00,a04,a08,a12,
                            a01,a05,a09,a13,
                            a02,a06,a10,a14,
                            a03,a07,a11,a15){
  this.elements =  [
    a00,a01,a02,a03,
    a04,a05,a06,a07,
    a08,a09,a10,a11,
    a12,a13,a14,a15
  ];
  return this;

};
N3D.Math.Matrix4.prototype = {
  constructor:N3D.Math.Matrix4,
  identity:function(){
    this.elements = [1,0,0,0,
                     0,1,0,0,
                     0,0,1,0,
                     0,0,0,1];
  },
  clone:function(){  
    var m = this.elements;
    return new this.constructor(
      m[0], m[4], m[8], m[12],
      m[1], m[5], m[9], m[13],
      m[2], m[6], m[10],m[14],
      m[3], m[7], m[11],m[15]
    );
  },
  inverse:function(){ 
    var m = this.elements, 
        m00 = m[0],  m04 = m[4],  m08 = m[8],  m12 = m[12],
        m01 = m[1],  m05 = m[5],  m09 = m[9],  m13 = m[13],
        m02 = m[2],  m06 = m[6],  m10 = m[10], m14 = m[14],
        m03 = m[3],  m07 = m[7],  m11 = m[11], m15 = m[15];
        
    
    var n0 =  m05 * (m10*m15 - m11*m14) - m06 * (m09*m15 - m11*m13) + m07 * (m09*m14 - m10*m13),
        n1 =  m04 * (m10*m15 - m11*m14) - m06 * (m08*m15 - m11*m12) + m07 * (m08*m14 - m10*m12),
        n2 =  m04 * (m09*m15 - m11*m13) - m05 * (m08*m15 - m11*m12) + m07 * (m08*m13 - m09*m12),
        n3 =  m04 * (m09*m14 - m10*m13) - m05 * (m08*m14 - m10*m12) + m06 * (m08*m13 - m09*m12),  
              
        inv_det = (m00*n0 - m01*n1 + m02*n2 - m03*n3);
    
    if(inv_det === 0){ throw new Error('Determinant == 0'); }
    
    inv_det = 1/inv_det;
    
    m[0]  =  n0 * inv_det;
    m[4]  = -n1 * inv_det;
    m[8]  =  n2 * inv_det;
    m[12] = -n3 * inv_det;     
    
    m[1]  = -(m01 * (m10*m15 - m11*m14) - m02 * (m09*m15 - m11*m13) + m03 * (m09*m14 - m10*m13)) * inv_det;  
    m[5]  =  (m00 * (m10*m15 - m11*m14) - m02 * (m08*m15 - m11*m12) + m03 * (m08*m14 - m10*m12)) * inv_det;
    m[9]  = -(m00 * (m09*m15 - m11*m13) - m01 * (m08*m15 - m11*m12) + m03 * (m08*m13 - m09*m12)) * inv_det;
    m[13]  = (m00 * (m09*m14 - m10*m13) - m01 * (m08*m14 - m10*m12) + m02 * (m08*m13 - m09*m12)) * inv_det;
    
    m[2]  =  (m01 * (m06*m15 - m07*m14) - m02 * (m05*m15 - m07*m13) + m03 * (m05*m14 - m06*m13)) * inv_det;
    m[6]  = -(m00 * (m06*m15 - m07*m14) - m02 * (m04*m15 - m07*m12) + m03 * (m04*m14 - m06*m12)) * inv_det;
    m[10] =  (m00 * (m05*m15 - m07*m13) - m01 * (m04*m15 - m07*m12) + m03 * (m04*m13 - m05*m12)) * inv_det;
    m[14] = -(m00 * (m05*m14 - m06*m13) - m01 * (m04*m14 - m06*m12) + m02 * (m04*m13 - m05*m12)) * inv_det;
    
    m[3] =  -(m01 * (m06*m11 - m07*m10) - m02 * (m05*m11 - m07*m09) + m03 * (m05*m10 - m06*m09)) * inv_det;
    m[7] =   (m00 * (m06*m11 - m07*m10) - m02 * (m04*m11 - m07*m08) + m03 * (m04*m10 - m06*m08)) * inv_det;
    m[11] = -(m00 * (m05*m11 - m07*m09) - m01 * (m04*m11 - m07*m08) + m03 * (m04*m09 - m05*m08)) * inv_det;
    m[15] =  (m00 * (m05*m10 - m06*m09) - m01 * (m04*m10 - m06*m08) + m02 * (m04*m09 - m05*m08)) * inv_det; 

    return this;
  },
  multiply:function(m2){
    var m1 = this.elements,
        m2 = m2.elements, 
      
        m1_00 = m1[0],  m1_04 = m1[4],  m1_08 = m1[8],  m1_12 = m1[12],
        m1_01 = m1[1],  m1_05 = m1[5],  m1_09 = m1[9],  m1_13 = m1[13],
        m1_02 = m1[2],  m1_06 = m1[6],  m1_10 = m1[10], m1_14 = m1[14],
        m1_03 = m1[3],  m1_07 = m1[7],  m1_11 = m1[11], m1_15 = m1[15], 
                                                   
        m2_00 = m2[0],  m2_04 = m2[4],  m2_08 = m2[8],  m2_12 = m2[12],
        m2_01 = m2[1],  m2_05 = m2[5],  m2_09 = m2[9],  m2_13 = m2[13],
        m2_02 = m2[2],  m2_06 = m2[6],  m2_10 = m2[10], m2_14 = m2[14],
        m2_03 = m2[3],  m2_07 = m2[7],  m2_11 = m2[11], m2_15 = m2[15];
      
    m1[0] = m1_00*m2_00 + m1_01*m2_04 + m1_02*m2_08 + m1_03*m2_12;
    m1[4] = m1_04*m2_00 + m1_05*m2_04 + m1_06*m2_08 + m1_07*m2_12;
    m1[8] = m1_08*m2_00 + m1_09*m2_04 + m1_10*m2_08 + m1_11*m2_12;
    m1[12] = m1_12*m2_00 + m1_13*m2_04 + m1_14*m2_08 + m1_15*m2_12;
    
    m1[1] = m1_00*m2_01 + m1_01*m2_05 + m1_02*m2_09 + m1_03*m2_13;
    m1[5] = m1_04*m2_01 + m1_05*m2_05 + m1_06*m2_09 + m1_07*m2_13;
    m1[9] = m1_08*m2_01 + m1_09*m2_05 + m1_10*m2_09 + m1_11*m2_13;
    m1[13] = m1_12*m2_01 + m1_13*m2_05 + m1_14*m2_09 + m1_15*m2_13;
    
    m1[2] = m1_00*m2_02 + m1_01*m2_06 + m1_02*m2_10 + m1_03*m2_14;
    m1[6] = m1_04*m2_02 + m1_05*m2_06 + m1_06*m2_10 + m1_07*m2_14;
    m1[10] = m1_08*m2_02 + m1_09*m2_06 + m1_10*m2_10 + m1_11*m2_14;
    m1[14] = m1_12*m2_02 + m1_13*m2_06 + m1_14*m2_10 + m1_15*m2_14;
    
    m1[3] = m1_00*m2_03 + m1_01*m2_07 + m1_02*m2_11 + m1_03*m2_15;
    m1[7] = m1_04*m2_03 + m1_05*m2_07 + m1_06*m2_11 + m1_07*m2_15;
    m1[11] = m1_08*m2_03 + m1_09*m2_07 + m1_10*m2_11 + m1_11*m2_15;
    m1[15] = m1_12*m2_03 + m1_13*m2_07 + m1_14*m2_11 + m1_15*m2_15;
    
    return this;
  },
  multiplyTranspose:function(m2){
    var m1 = this.elements,
        m2 = m2.elements, 
        m1_00 = m1[0],  m1_04 = m1[4],  m1_08 = m1[8],  m1_12 = m1[12],
        m1_01 = m1[1],  m1_05 = m1[5],  m1_09 = m1[9],  m1_13 = m1[13],
        m1_02 = m1[2],  m1_06 = m1[6],  m1_10 = m1[10], m1_14 = m1[14],
        m1_03 = m1[3],  m1_07 = m1[7],  m1_11 = m1[11], m1_15 = m1[15], 
                                                   
        m2_00 = m2[0],  m2_04 = m2[4],  m2_08 = m2[8],  m2_12 = m2[12],
        m2_01 = m2[1],  m2_05 = m2[5],  m2_09 = m2[9],  m2_13 = m2[13],
        m2_02 = m2[2],  m2_06 = m2[6],  m2_10 = m2[10], m2_14 = m2[14],
        m2_03 = m2[3],  m2_07 = m2[7],  m2_11 = m2[11], m2_15 = m2[15];

    m1[0] =   m1_00*m2_00 + m1_04*m2_01 + m1_08*m2_02 + m1_12*m2_03;
    m1[1] =   m1_01*m2_00 + m1_05*m2_01 + m1_09*m2_02 + m1_13*m2_03;
    m1[2] =   m1_02*m2_00 + m1_06*m2_01 + m1_10*m2_02 + m1_14*m2_03;
    m1[3] =  m1_03*m2_00 + m1_07*m2_01 + m1_11*m2_02 + m1_15*m2_03;
    
    m1[4] =   m1_00*m2_04 + m1_04*m2_05 + m1_08*m2_06 + m1_12*m2_07;
    m1[5] =   m1_01*m2_04 + m1_05*m2_05 + m1_09*m2_06 + m1_13*m2_07;
    m1[6] =   m1_02*m2_04 + m1_06*m2_05 + m1_10*m2_06 + m1_14*m2_07;
    m1[7] =  m1_03*m2_04 + m1_07*m2_05 + m1_11*m2_06 + m1_15*m2_07;    
    
    m1[8] =   m1_00*m2_08 + m1_04*m2_09 + m1_08*m2_10 + m1_12*m2_11;
    m1[9] =   m1_01*m2_08 + m1_05*m2_09 + m1_09*m2_10 + m1_13*m2_11;
    m1[10] =  m1_02*m2_08 + m1_06*m2_09 + m1_10*m2_10 + m1_14*m2_11;
    m1[11] =  m1_03*m2_08 + m1_07*m2_09 + m1_11*m2_10 + m1_15*m2_11;
    
    m1[12] =   m1_00*m2_12 + m1_04*m2_13 + m1_08*m2_14 + m1_12*m2_15;
    m1[13] =   m1_01*m2_12 + m1_05*m2_13 + m1_09*m2_14 + m1_13*m2_15;
    m1[14] =  m1_02*m2_12 + m1_06*m2_13 + m1_10*m2_14 + m1_14*m2_15;
    m1[15] =  m1_03*m2_12 + m1_07*m2_13 + m1_11*m2_14 + m1_15*m2_15;

    return this;
  },
  multiplyVector4:function(v){
    var x = v.x, y = v.y, z = v.z, w = v.w;
    var m = this.elements;

    return new v.constructor(
      m[0]*x + m[4]*y + m[8]*z + m[12]*w,
      m[1]*x + m[5]*y + m[9]*z + m[13]*w,
      m[2]*x + m[6]*y + m[10]*z + m[14]*w,
      m[3]*x + m[7]*y + m[11]*z + m[15]*w
    );
  },
  rotateX: function(radians){
    var m = this.elements;
    
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    var m04 = m[4], m05 = m[5], m06 = m[6],  m07 = m[7],
        m08 = m[8], m09 = m[9], m10 = m[10], m11= m[11];
    
    
    m[4] = m04 * c + m08 * s; m[5] = m05 * c + m09 * s; m[6] = m06 * c + m10 * s; m[7] = m07 * c + m11 * s;
    m[8] = m04 * -s + m08 * c; m[9] = m05 * -s + m09 * c; m[10] = m06 * -s + m10 * c; m[11] = m07 * -s + m11 * c;
    
    return this;
  },
  rotateY: function(radians){
    var m = this.elements;
    
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    var m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3],
        m08 = m[8], m09 = m[9], m10= m[10], m11= m[11];
    
    m[0] = m00 * c + m08 * -s; m[1] = m01 * c + m09 * -s; m[2] = m02 * c + m10* -s; m[3] = m03 * c + m11* -s;
    m[8] = m00 * s + m08 * c; m[9] = m01 * s + m09 * c; m[10]= m02 * s + m10* c; m[11] = m03 * s + m11 * c;    

    return this;
  },
  rotateZ: function(radians){
    var m = this.elements;
    
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    var m00 = m[0], m01 = m[1], m02 = m[2],  m03 = m[3],
        m04 = m[4], m05 = m[5], m06 = m[6],  m07 = m[7];
    
    m[0] = m00 * c + m04 * s; m[1] = m01 * c + m05 * s; m[2] = m02 * c + m06* s; m[3] = m03 * c + m07* s;
    m[4] = m00 * -s + m04 * c; m[5] = m01 * -s + m05 * c; m[6] = m02 * -s + m06* c; m[7] = m03 * -s + m07* c;

    return this;
  },  
  rotateAroundAxis:function(r,v){
    var c = Math.cos(r), s = Math.sin(r);
    
    var x = v.x,y = v.y, z = v.z, t = 1-c,
        xyt = x*y*t, xzt = x*z*t, yzt = y*z*t,
        xs = x*s, ys = y*s, zs = z*s;
        
    var m = this.elements, 
        m00 = m[0],  m04 = m[4],  m08 = m[8],  m12 = m[12],
        m01 = m[1],  m05 = m[5],  m09 = m[9],  m13 = m[13],
        m02 = m[2],  m06 = m[6],  m10 = m[10], m14 = m[14],
        m03 = m[3],  m07 = m[7],  m11 = m[11], m15 = m[15];
    
    var a00 = c+x*x*t, a04 = xyt-zs, a08 = xzt+ys,
        a01 = xyt+zs,  a05 = c+y*y*t,a09 = yzt-xs,
        a02 = xzt-ys,  a06 = yzt+xs, a10 = c+z*z*t;

    m[0] = m00*a00 + m01*a04 + m02*a08;
    m[4] = m04*a00 + m05*a04 + m06*a08;
    m[8] = m08*a00 + m09*a04 + m10*a08;
    m[12] = m12*a00 + m13*a04 + m14*a08;   
    
    m[1] = m00*a01 + m01*a05 + m02*a09;
    m[5] = m04*a01 + m05*a05 + m06*a09;
    m[9] = m08*a01 + m09*a05 + m10*a09;
    m[13] = m12*a01 + m13*a05 + m14*a09;
    
    m[2] = m00*a02 + m01*a06 + m02*a10;
    m[6] = m04*a02 + m05*a06 + m06*a10;
    m[10] = m08*a02 + m09*a06 + m10*a10;
    m[14] = m12*a02 + m13*a06 + m14*a10;

    return this;
  },
  scale:function(x,y,z){
    var m = this.elements;
    
    m[0] *= x;  m[4] *= y;  m[8] *= z;         
    m[1] *= x;  m[5] *= y;  m[9] *= z;
    m[2] *= x;  m[6] *= y;  m[10]*= z;
    m[3] *= x;  m[7] *= y;  m[11]*= z;    
    
    return this;
  },
  translate:function(x,y,z){
    var m = this.elements;
    
    m[12] = m[0]*x + m[4]*y + m[8]*z + m[12];
		m[13] = m[1]*x + m[5]*y + m[9]*z + m[13];
		m[14] = m[2]*x + m[6]*y + m[10]*z + m[14];
		m[15] = m[3]*x + m[7]*y + m[11]*z + m[15];
    
    return this;
  },
  transpose:function(){
    var m = this.elements;
    var a01 = m[1], a02 = m[2], a03 = m[3],
        a12 = m[6], a13 = m[7],
        a23 = m[11];
                
    m[1] = m[4]; m[2] = m[8]; m[3] = m[12];
    m[4] = a01;  m[6] = m[9]; m[7] = m[13];
    m[8] = a02;  m[9] = a12;  m[11] = m[14];
    m[12] = a03; m[13] = a13; m[14] = a23;
    
    return this;  
  },
  toString:function(){
    var e = this.elements;
    return '00: '+e[0].toFixed(3)+', 04: '+e[4].toFixed(3)+', 08: '+e[8].toFixed(3)+', 12: '+e[12].toFixed(3) + '\n' + 
           '01: '+e[1].toFixed(3)+', 05: '+e[5].toFixed(3)+', 09: '+e[9].toFixed(3)+', 13: '+e[13].toFixed(3) + '\n' + 
           '02: '+e[2].toFixed(3)+', 06: '+e[6].toFixed(3)+', 10: '+e[10].toFixed(3)+', 14: '+e[14].toFixed(3) + '\n' + 
           '03: '+e[3].toFixed(3)+', 07: '+e[7].toFixed(3)+', 11: '+e[11].toFixed(3)+', 15: '+e[15].toFixed(3);
  }
};

(function(){
  var store = [];

  N3D.Math.Matrix4.Save = function(m){
    store.push(m.elements.slice());
  };
  
  N3D.Math.Matrix4.Restore = function(m){
    m.elements = store.pop();
  };
  
})();

N3D.Math.Matrix4.Identity = function(){
  return new N3D_M_Matrix4(
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
  );
};


N3D.Math.Matrix4.Multiply = function(m1,m2){
  var m1 = m1.elements,
      m2 = m2.elements, 
      
      m1_00 = m1[0],  m1_04 = m1[4],  m1_08 = m1[8],  m1_12 = m1[12],
      m1_01 = m1[1],  m1_05 = m1[5],  m1_09 = m1[9],  m1_13 = m1[13],
      m1_02 = m1[2],  m1_06 = m1[6],  m1_10 = m1[10], m1_14 = m1[14],
      m1_03 = m1[3],  m1_07 = m1[7],  m1_11 = m1[11], m1_15 = m1[15], 
                                                   
      m2_00 = m2[0],  m2_04 = m2[4],  m2_08 = m2[8],  m2_12 = m2[12],
      m2_01 = m2[1],  m2_05 = m2[5],  m2_09 = m2[9],  m2_13 = m2[13],
      m2_02 = m2[2],  m2_06 = m2[6],  m2_10 = m2[10], m2_14 = m2[14],
      m2_03 = m2[3],  m2_07 = m2[7],  m2_11 = m2[11], m2_15 = m2[15];
      
  return new N3D_M_Matrix4(
    m1_00*m2_00 + m1_01*m2_04 + m1_02*m2_08 + m1_03*m2_12,
    m1_04*m2_00 + m1_05*m2_04 + m1_06*m2_08 + m1_07*m2_12,
    m1_08*m2_00 + m1_09*m2_04 + m1_10*m2_08 + m1_11*m2_12,
    m1_12*m2_00 + m1_13*m2_04 + m1_14*m2_08 + m1_15*m2_12,
    
    m1_00*m2_01 + m1_01*m2_05 + m1_02*m2_09 + m1_03*m2_13,
    m1_04*m2_01 + m1_05*m2_05 + m1_06*m2_09 + m1_07*m2_13,
    m1_08*m2_01 + m1_09*m2_05 + m1_10*m2_09 + m1_11*m2_13,
    m1_12*m2_01 + m1_13*m2_05 + m1_14*m2_09 + m1_15*m2_13,
    
    m1_00*m2_02 + m1_01*m2_06 + m1_02*m2_10 + m1_03*m2_14,
    m1_04*m2_02 + m1_05*m2_06 + m1_06*m2_10 + m1_07*m2_14,
    m1_08*m2_02 + m1_09*m2_06 + m1_10*m2_10 + m1_11*m2_14,
    m1_12*m2_02 + m1_13*m2_06 + m1_14*m2_10 + m1_15*m2_14,
    
    m1_00*m2_03 + m1_01*m2_07 + m1_02*m2_11 + m1_03*m2_15,
    m1_04*m2_03 + m1_05*m2_07 + m1_06*m2_11 + m1_07*m2_15,
    m1_08*m2_03 + m1_09*m2_07 + m1_10*m2_11 + m1_11*m2_15,
    m1_12*m2_03 + m1_13*m2_07 + m1_14*m2_11 + m1_15*m2_15
  );   
};



N3D.Math.Matrix4.MultiplyTranspose = function(m1,m2){
  var m1 = m1.elements,
      m2 = m2.elements, 
      
      m1_00 = m1[0],  m1_04 = m1[4],  m1_08 = m1[8],  m1_12 = m1[12],
      m1_01 = m1[1],  m1_05 = m1[5],  m1_09 = m1[9],  m1_13 = m1[13],
      m1_02 = m1[2],  m1_06 = m1[6],  m1_10 = m1[10], m1_14 = m1[14],
      m1_03 = m1[3],  m1_07 = m1[7],  m1_11 = m1[11], m1_15 = m1[15], 
                                                   
      m2_00 = m2[0],  m2_04 = m2[4],  m2_08 = m2[8],  m2_12 = m2[12],
      m2_01 = m2[1],  m2_05 = m2[5],  m2_09 = m2[9],  m2_13 = m2[13],
      m2_02 = m2[2],  m2_06 = m2[6],  m2_10 = m2[10], m2_14 = m2[14],
      m2_03 = m2[3],  m2_07 = m2[7],  m2_11 = m2[11], m2_15 = m2[15];
    
  return new N3D_M_Matrix4(        
    m1_00*m2_00 + m1_04*m2_01 + m1_08*m2_02 + m1_12*m2_03,
    m1_00*m2_04 + m1_04*m2_05 + m1_08*m2_06 + m1_12*m2_07,
    m1_00*m2_08 + m1_04*m2_09 + m1_08*m2_10 + m1_12*m2_11,
    m1_00*m2_12 + m1_04*m2_13 + m1_08*m2_14 + m1_12*m2_15,
    
    m1_01*m2_00 + m1_05*m2_01 + m1_09*m2_02 + m1_13*m2_03,
    m1_01*m2_04 + m1_05*m2_05 + m1_09*m2_06 + m1_13*m2_07,
    m1_01*m2_08 + m1_05*m2_09 + m1_09*m2_10 + m1_13*m2_11,
    m1_01*m2_12 + m1_05*m2_13 + m1_09*m2_14 + m1_13*m2_15,
    
    m1_02*m2_00 + m1_06*m2_01 + m1_10*m2_02 + m1_14*m2_03,
    m1_02*m2_04 + m1_06*m2_05 + m1_10*m2_06 + m1_14*m2_07,
    m1_02*m2_08 + m1_06*m2_09 + m1_10*m2_10 + m1_14*m2_11,
    m1_02*m2_12 + m1_06*m2_13 + m1_10*m2_14 + m1_14*m2_15,
    
    m1_03*m2_00 + m1_07*m2_01 + m1_11*m2_02 + m1_15*m2_03,
    m1_03*m2_04 + m1_07*m2_05 + m1_11*m2_06 + m1_15*m2_07,
    m1_03*m2_08 + m1_07*m2_09 + m1_11*m2_10 + m1_15*m2_11,
    m1_03*m2_12 + m1_07*m2_13 + m1_11*m2_14 + m1_15*m2_15 
  );  
};

N3D.Math.Matrix4.CreateLookAt = function(eye,target,up){
  /*var f = N3D_M_Vector3.Sub(eye,target).normalize(),
      s = N3D_M_Vector3.Cross(up,f).normalize(),
      u = N3D_M_Vector3.Cross(f,s);*/
      
  var f = eye.clone().sub(target).normalize(),
      s = up.clone().cross(f).normalize(),
      u = f.clone().cross(s);     
      
  return new N3D_M_Matrix4(
    s.x,  u.x,  f.x,  -eye.x,
    s.y,  u.y,  f.y,  -eye.y,
    s.z,  u.z,  f.z,  -eye.z,
    0,    0,    0,    1 
  );
};

N3D.Math.Matrix4.CreateRotationX = function(r){
  var c = Math.cos(r), s = Math.sin(r);
  
  return new N3D_M_Matrix4(
    1,0,0,0,
    0,c,-s,0,
    0,s,c,0,
    0,0,0,1
  );
};


N3D.Math.Matrix4.CreateRotationY = function(r){
  var c = Math.cos(r), s = Math.sin(r);
  
  return new N3D_M_Matrix4(
    c,0,s,0,
    0,1,0,0,
    -s,0,c,0,
    0,0,0,1
  );
};
N3D.Math.Matrix4.CreateRotationZ = function(r){
  var c = Math.cos(r), s = Math.sin(r);
  
  return new N3D_M_Matrix4(
    c,-s,0,0,
    s,c,0,0,
    0,0,1,0,
    0,0,0,1
  );
};

N3D.Math.Matrix4.CreateRotationAroundAxis = function(r,v){
  var c = Math.cos(r), s = Math.sin(r);
  var x = v.x,y = v.y, z = v.z,
      t = 1-c,
      xyt = x*y*t, xzt = x*z*t, yzt = y*z*t,
      xs = x*s, ys = y*s, zs = z*s;
  
  return new N3D_M_Matrix4(
    c+x*x*t, xyt-zs,  xzt+ys,  0,
    xyt+zs,  c+y*y*t,  yzt-xs,  0,
    xzt-ys,  yzt+xs,  c+z*z*t,  0,
    0,        0,        0,        1
  );
};

N3D.Math.Matrix4.CreateScale = function(x,y,z){
  return new N3D_M_Matrix4(
    x,0,0,0,
    0,y,0,0,
    0,0,z,0,
    0,0,0,1
  );
};

N3D.Math.Matrix4.CreateTranslation = function(x,y,z){
  return new N3D_M_Matrix4(
    1,0,0,x,
    0,1,0,y,
    0,0,1,z,
    0,0,0,1
  );
};

N3D.Math.Matrix4.CreateFrustum = function(left,right,bottom,top,near,far){
  var rl = right - left,
      tb = top - bottom,
      fn = far - near,
      n2 = 2 * near;
  return new N3D_M_Matrix4(
    n2/rl,            0,                0,                0,
    0,                n2/tb,            0,                0,
    (right+left)/rl,  (top+bottom)/tb,  -(far+near)/fn,   -1,
    0,                0,                -n2*far/fn,         0
  );
};

N3D.Math.Matrix4.CreatePerspective = function(angle,aspectRatio,near,far){
  var scale = Math.tan(angle * N3D_M.PiOver360) * near,
      right = aspectRatio * scale,
      fn = far - near,
      tb = scale + scale,
      rl = right + right,
      n2 = 2 * near;
      
  return new N3D_M_Matrix4(
    n2/rl,  0,      (right-right)/rl,       0,
    0,      n2/tb,  (scale-scale)/tb,       0,
    0,      0,      -(far+near)/fn,         -1,
    0,      0,      -n2*far/fn,             0
  );
};

N3D.Math.Matrix4.CreatePerspective2 = function(angle,aspectRatio,near,far){
  var scale = Math.tan(angle * N3D_M.PiOver360) * near,
      right = aspectRatio * scale;

  return N3D_M_Matrix4.CreateFrustum(-right,right,-scale,scale,near,far);
};

N3D.Math.Matrix4.CreateOrthographic = function(l,r,b,t,n,f){
  var rl = r - l,
	    tb = t - b,
	    fn = f - n;
  
  return new N3D_M_Matrix4(
    2/rl,       0,          0,          0,
    0,          2/tb,       0,          0,
    0,          0,          -2/fn,      0,
    -(l+r)/rl,  -(t+b)/tb,  -(f+n)/fn,  1
  );
};

N3D.Math.Matrix4.CreateFromQuaternion = function(q){
  q.normalize();
  
  var x = q.x, y = q.y, z = q.z, w = 0;
  
  var xx = x*x, xy = x*y, xz = x*z, xw = x*w, 
      yy = y*y, yz = y*z, yw = y*w,
      zz = z*z, zw = z*w;
  
  return new N3D_M_Matrix4(
    1 - 2*(yy+zz),  2*(xy-zw),    2*(xz+yw),    0,
    2*(xy+zw),      1-2*(xx+zz),  2*(yz-xw),    0,
    2*(xz-yw),      2*(yz+xw),    1-2*(xx+yy),  0,
    0,              0,            0,            1 
     
  );
};
/* <<<< Matrix 4x4 <<<< */


/* >>>> Vector 2 >>>> */
N3D.Math.Vector2 = function(x,y){
  this.x = x;
  this.y = y;

  return this;
};
N3D.Math.Vector2.prototype = {
  constructor:N3D.Math.Vector2,
  clone:function(){
    return new this.constructor(this.x,this.y);
  },
  copyFromVector:function(o){
    this.x = o.x;
    this.y = o.y;
    
    return this;
  },
  equals:function(v){
    return (this.x == v.x && this.y == v.y);
  },
  add:function(v){
    this.x += v.x; this.y += v.y;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x; this.y -= v.y;
    
    return this;  
  },
  multiply:function(v){
    this.x *= v.x; this.y *= v.y;
    
    return this;  
  },
  divide:function(v){
    this.x /= v.x; this.y /= v.y;
    
    return this;  
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y);
  },
  normalize:function(){
    var x = this.x, y = this.y;
    var inv_length = 1/Math.sqrt(x*x + y*y);
    
    this.x *= inv_length; this.y *= inv_length;
    
    return this; 
  },
  scale:function(n){
    this.x *= n; this.y *= n;
    
    return this;
  },
  length:function(){
    var x = this.x, y = this.y;
    return Math.sqrt(x*x + y*y);
  },
  distance:function(v){
    var x = this.x - v.x, y = this.y - v.y;
    
    return Math.sqrt(x*x + y*y);
  },
  multiplyMatrix2:function(m){
    var m = m.elements;
    var x = this.x, y = this.y;
    
    this.x = m[0] * x + m[2] * y;
    this.y = m[1] * x + m[3] * y;
   
    return this; 
  },
  toString:function(){
    return "Vector2 ("+this.x+","+this.y+")";
  }  
};
/* <<<< Vector 2 <<<< */


/* >>>> Vector 3 >>>> */
N3D.Math.Vector3 = function(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
  
  return this;
};
N3D.Math.Vector3.prototype = {
  constructor:N3D.Math.Vector3,
  clone:function(){
    return new this.constructor(this.x,this.y,this.z);
  },
  copyFromVector:function(o){
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    
    return this;
  },
  equals:function(v){
    return (this.x == v.x && this.y == v.y && this.z == v.z);
  },
  add:function(v){
    this.x += v.x; this.y += v.y; this.z += v.z;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x; this.y -= v.y; this.z -= v.z;
    
    return this;
  },
  multiply:function(v){
    this.x *= v.x; this.y *= v.y; this.z *= v.z;
    
    return this;
  },
  divide:function(v){
    this.x /= v.x; this.y /= v.y; this.z /= v.z;
    
    return this;
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z);
  },
  normalize:function(){
    var x = this.x, y = this.y, z = this.z;
    var inv_length = 1/Math.sqrt(x*x + y*y + z*z);
    
    this.x *= inv_length; this.y *= inv_length; this.z *= inv_length;
    
    return this; 
  },
  scale:function(n){
    this.x *= n; this.y *= n; this.z *= n;
    
    return this;
  },
  length:function(){
    var x = this.x,y = this.y,z = this.z;
    return Math.sqrt(x*x + y*y + z*z);
  },
  distance:function(v){
    var x = this.x - v.x, y = this.y - v.y, z = this.z - v.z;
    
    return Math.sqrt(x*x + y*y + z*z);
  },
  cross:function(v){
    var tx = this.x,  ty = this.y,  tz = this.z,
        vx = v.x,     vy = v.y,     vz = v.z;
    
    this.x = ty*vz - tz*vy;
    this.y = tz*vx - tx*vz;
    this.z = tx*vy - ty*vx;
    
    return this;
  },
  multiplyMatrix3:function(m){
    var m = m.elements;
    var x = this.x, y = this.y, z = this.z;
    
    this.x = m[0] * x + m[3] * y + m[6] * z;
    this.y = m[1] * x + m[4] * y + m[7] * z;
    this.z = m[2] * x + m[5] * y + m[8] * z;
   
    return this; 
  },
  toString:function(){
    return "Vector3 ("+this.x+","+this.y+","+this.z+")";
  }
};

N3D.Math.Vector3.Up = new N3D.Math.Vector3(0,1,0);
N3D.Math.Vector3.Right = new N3D.Math.Vector3(1,0,0);
N3D.Math.Vector3.Forward = new N3D.Math.Vector3(0,0,-1);
/* <<<< Vector 3 <<<< */



/* >>>> Vector 4 >>>> */
N3D.Math.Vector4 = function(x,y,z,w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  
  return this;
};
N3D.Math.Vector4.prototype = {
  constructor:N3D.Math.Vector4,
  clone:function(){
    return new this.constructor(this.x,this.y,this.z,this.w);
  },
  copyFromVector:function(o){
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    this.w = o.w;
    
    return this;
  },
  equals:function(v){
    return (this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w);
  },
  add:function(v){
    this.x += v.x; this.y += v.y; this.z += v.z; this.w += v.w;
    
    return this;
  },
  sub:function(v){
    this.x -= v.x; this.y -= v.y; this.z -= v.z; this.w -= v.w;
    
    return this;
  },
  multiply:function(v){
    this.x *= v.x; this.y *= v.y; this.z *= v.z; this.w *= v.w;
    
    return this;
  },
  divide:function(v){
    this.x /= v.x; this.y /= v.y; this.z /= v.z; this.w /= v.w;
    
    return this;
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w);
  },
  normalize:function(){  //zjistit
    var x = this.x, y = this.y, z = this.z;
    var inv_length = 1/Math.sqrt(x*x+y*y+z*z);
    
    this.x *= inv_length; this.y *= inv_length; this.z *= inv_length;
    
    return this;
  },
  scale:function(n){
    this.x *= n; this.y *= n; this.z *= n; this.w *= n;
    
    return this;
  },
  length:function(){
    var x = this.x,y = this.y,z = this.z;
    return Math.sqrt(x*x + y*y + z*z);
  },
  distance:function(v){
    var x = this.x - v.x, y = this.y - v.y, z = this.z - v.z;
    
    return Math.sqrt(x*x + y*y + z*z);
  }, 
  cross:function(v){
    var tx = this.x,  ty = this.y,  tz = this.z,
        vx = v.x,     vy = v.y,     vz = v.z;
    
    this.x = ty*vz - tz*vy; 
    this.y = tz*vx - tx*vz; 
    this.z = tx*vy - ty*vx; 
    this.w = 0;
    
    return this;
  },
  multiplyMatrix4:function(m){
    var m = m.elements;
    var x = this.x, y = this.y, z = this.z,w = this.w;
    
    this.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    this.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    this.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    this.w = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
   
    return this; 
  },
  toString:function(){
    return "Vector4 ("+this.x+","+this.y+","+this.z+","+this.w+")";
  }
};


N3D.Math.Vector4.Min = function(v1,v2,v_src){
  v_src.x = Math.min(v1.x,v2.x);
  v_src.y = Math.min(v1.y,v2.y);
  v_src.z = Math.min(v1.z,v2.z);
};

N3D.Math.Vector4.Max = function(v1,v2,v_src){
  v_src.x = Math.max(v1.x,v2.x);
  v_src.y = Math.max(v1.y,v2.y);
  v_src.z = Math.max(v1.z,v2.z);
};
/* <<<< Vector 4 <<<< */







N3D_M = N3D.Math;

$M2 = N3D_M_Matrix2 = N3D.Math.Matrix2;
$M3 = N3D_M_Matrix3 = N3D.Math.Matrix3;
$M4 = N3D_M_Matrix4 = N3D.Math.Matrix4; 

$V2 = N3D_M_Vector2 = N3D.Math.Vector2;
$V3 = N3D_M_Vector3 = N3D.Math.Vector3; 
$V4 = N3D_M_Vector4 = N3D.Math.Vector4;