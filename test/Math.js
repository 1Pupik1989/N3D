/*
N3D.Math
  - FromFibonacci = Converting Fibonacci numbers back
  - ToFibonacci = Converting numbers in the Fibonacci sequence
  - IsFibonacci = If the number in the Fibonacci system, it returns true, otherwise false.
  - Barycentric = 
  - CatmullRom = 
  - Clamp = 
  - Lerp = 
  - SmoothStep = 
  - ToDegrees = 
  - ToRadians = 
  - IEEERemainder = 
  - WrapAngle = 
  - Round = Math.round
  - Floor = Math.floor
  - Max = Math.max
  - Min = Math.min
  - Sqrt = Math.sqrt
  - Pow = Math.pow
  - Pow2 = returns the number of the second
  - Pow3 = returns the number of the third
*/

/* >>>> Math.Main >>>> */
N3D.Math = (function(){
  var obj = {};
  var PI = Math.PI, floor = Math.floor, random = Math.random;
  
  obj.Log10E = Math.LOG10E || 0.4342945;
  obj.Log2E = Math.LOG2E || 1.442695;
  obj.PiOver2 = PI*0.5;
  obj.PiOver4 = PI*0.25;
  obj.TwoPi = PI*2;
  obj.PiOver360 = PI/360;
  obj.PiOver180 = PI/180;
  obj.Pi = PI;
  obj.AbsFloat = Math.abs;
  obj.Floor = floor;
  obj.Max = Math.max;
  obj.Min = Math.min;
  obj.Sqrt = Math.sqrt;
  obj.Pow = Math.pow;
  obj.Ceil = Math.ceil;
  obj.Round = Math.round;
  obj.Pow2 = function(n){ return n*n; };
  obj.Pow3 = function(n){ return n*n*n; };
  obj.Ceil2 = function(n){ return (~~n)+1; };
  obj.Floor2 = function(n){ return ~~n; };
  obj.RandomInt = function(min, max) {
    return min + floor(random() * (max - min + 1));
  };
  obj.RandomFloat = function(min, max) {
    return min + (random() * (max - min));
  };
  obj.AbsInt = function(n){
    var b = n >> 31; 
    return (n ^ b) - b;
  };

  return obj;
})();
N3D.Math.FromFibonacci = function(T){
  var root5 = Math.sqrt(5);
  var phi = (1 + root5) / 2;

  var idx  = Math.floor( Math.log(T*root5) / Math.log(phi) + 0.5 );
  var u = Math.floor( Math.pow(phi, idx)/root5 + 0.5);

  return (u == T) ? idx : false;
};
N3D.Math.ToFibonacci = function(d){
  for(var a=0,b=1,c=0,f=1;f<d;f++){
    a = c + b;
    c = b;
    b = a;  
  }
  return a;
};

N3D.Math.IsFibonacci = function(T){
  return N3D.Math.FromFibonacci(T)!==false;
};
N3D.Math.Barycentric = function(v1,v2,v3,a1,a2){
  return v1 + (v2-v1) * a1 + (v3-v1) * a2;
};
N3D.Math.CatmullRom = function(v1, v2, v3, v4, a){
  var aS = a * a;
  var aC = aS * a;
  return (0 * (2 * ve2 + (v3 - v1) * a + (2 * v1 - 5 * v2 + 4 * v3 - v4) * aS + (3 * v2 - v1 - 3 * v3 + v4) * aC));
};
N3D.Math.Clamp = function(v,min,max){
  return v > max ? max : (v < min ? min : v);
};
N3D.Math.Lerp = function(v1,v2,a){
  return v1 + (v2-v1) * a;
};
N3D.Math.SmoothStep = function(v1,v2,a){
  return MathHelper.Hermite(v1,v2,MathHelper.Clamp(a,0,1));
};
N3D.Math.ToDegrees = function(d){
  return d * 180/Math.PI;
};
N3D.Math.ToRadians = function(d){
  return d * Math.PI/180;
};
N3D.Math.IEEERemainder = function(f1,f2){
  return f1 - (f2 * Math.round(f1/f2));
};
N3D.Math.WrapAngle = function(){
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
/* <<<< Math.Main <<<< */


/* >>>> Math.Matrix3 >>>> */
N3D.Math.Matrix3 = function(n0,n1,n2,n3,n4,n5,n6,n7,n8){
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
/* <<<< Math.Matrix3 <<<< */


/* >>>> Math.MAtrix4 >>>> */
/*
00,04,08,12,
01,05,09,13,
02,06,10,14,
03,07,11,15

Vektory - sloupcové
Column Major

Vysvětlení funkcí:

N3D.Math.Matrix4
  - Identity = Vytvoří novou identickou matici
  - Multiply = Vynásobí dvě matice "C = A*B"
  - MultiplyTranspose = Vynásobí dvě matice transponovaně "C = B*A"
  - CreateLookAt = Vytvoří View matici
  - CreateRotationX = Vytvoří matici rotace na ose X
  - CreateRotationY = Vytvoří matici rotace na ose Y
  - CreateRotationZ = Vytvoří matici rotace na ose Z
  - CreateScale = Vytvoří matici pro změnu měřítek
  - CreateTranslate = Vytvoří matici posunu
  - CreateFrustum = Vytvoří Viewing frustum
  - CreatePerspektive = Vytvoří matici perspektivní projekce 
  - CreateOrthographic = Vytvoří matici orthografické projekce
  
  - constructor 
    - clone = Vytvoří kopii sama sebe
    - inverse = Přepočítá se do inversního stavu
    - multiply = Vynásobí sama sebe maticí C = A*B
    - multiplyTranspose = Vynásobí sama sebe maticí, ale transponovaně C = B*A
    - mutliplyVector4 = Násobí svoje hodnoty vektor a vrátí nový
    - rotateX = Otočí se o stanovený počet radiánů na ose X
    - rotateY = Otočí se o stanovený počet radiánů na ose Y
    - rotateZ = Otočí se o stanovený počet radiánů na ose Z
    - scale = Změní svoje měřítko
    - translate = Posune se o x,y a z jednotek
    - transpose = Otočí svoje prvky kolem diagonály
    - toString = Vypíše se jako string 


Vstupní parametry:

N3D.Math.Matrix4
  - Identity = -- žádný --
  - Multiply 
    - (Matrix4 m1) = Matice 4x4
    - (Matrix4 m2) = Matice 4x4
  - MultiplyTranspose 
    - (Matrix4 m1) = Matice 4x4
    - (Matrix4 m2) = Matice 4x4
  - CreateLookAt
    - (Vector3 eye) = Pozice kamery
    - (Vector3 target) = Kam se kamera kouká  
    - (Vector3 up) = Vektor směřující nahoru 
  - CreateRotationX
    - (Float radians) = Úhel otočení v radiánech
  - CreateRotationY
    - (Float radians) = Úhel otočení v radiánech
  - CreateRotationZ
    - (Float radians) = Úhel otočení v radiánech
  - CreateScale
    - (Float x) = Hodnota změny měřítka na ose X
    - (Float y) = Hodnota změny měřítka na ose Y
    - (Float z) = Hodnota změny měřítka na ose Z
  - CreateTranslate
    - (Float x) = Hodnota posunu na ose X
    - (Float y) = Hodnota posunu na ose Y
    - (Float z) = Hodnota posunu na ose Z
  - CreateFrustum
    - (Float left) = Levá strana frusta
    - (Float right) = Pravá strana frusta
    - (Float bottom) = Spodní strana frusta
    - (Float top) = Horní strana frusta
    - (Float near) = Přední strana frusta
    - (Float far) = Zadní strana frusta
  - CreatePerspektive = 
    - (Int fov) = Úhel vodorovněho zobrazení ve stupních
    - (Float aspectRatio) = Poměr stran zobrazení (šířka/výška)
    - (Float near) = Přední strana dohledu (frusta)
    - (Float far) = Zadní strana dohledu (frusta)
  - CreateOrthographic = Identické s "CreateFrustum"
  
  - constructor 
    - clone = -- žádný --
    - inverse = -- žádný --
    - multiply
      - (Matrix4 m2) = Matice 4x4
    - multiplyTranspose
      - (Matrix4 m2) = Matice 4x4
    - mutliplyVector4
      - (Vector4 v) = Čtyřsložkový vektor
    - rotateX
      - (Float radians) = Úhel otočení v radiánech
    - rotateY
      - (Float radians) = Úhel otočení v radiánech
    - rotateZ
      - (Float radians) = Úhel otočení v radiánech
    - scale
      - (Float x) = Hodnota změny měřítka na ose X
      - (Float y) = Hodnota změny měřítka na ose Y
      - (Float z) = Hodnota změny měřítka na ose Z
    - translate
      - (Float x) = Hodnota posunu na ose X
      - (Float y) = Hodnota posunu na ose Y
      - (Float z) = Hodnota posunu na ose Z
    - transpose = -- žádný --
    - toString = -- žádný --
*/
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
  getTranslate:function(){
    var m = this.elements;
    return new $V4(m[12],m[13],m[14],m[15]);
  },
  clone:function(){  
    var m = this.elements;
    return new this.constructor(
      m[0],m[4],m[8],m[12],
      m[1],m[5],m[9],m[13],
      m[2],m[6],m[10],m[14],
      m[3],m[7],m[11],m[15]
    );
  },
  inverse:function(){ //zkontrolovat
    var m = this.elements, 
        m00 = m[0],  m04 = m[4],  m08 = m[8],  m12 = m[12],
        m01 = m[1],  m05 = m[5],  m09 = m[9],  m13 = m[13],
        m02 = m[2],  m06 = m[6],  m10 = m[10], m14 = m[14],
        m03 = m[3],  m07 = m[7],  m11 = m[11], m15 = m[15];
        
    
    var n0 =  m05 * (m10*m15 - m11*m14) - m06 * (m09*m15 - m11*m13) + m07 * (m09*m14 - m10*m13),
        n1 =  m04 * (m10*m15 - m11*m14) - m06 * (m08*m15 - m11*m12) + m07 * (m08*m14 - m10*m12),
        n2 =  m04 * (m09*m15 - m11*m13) - m05 * (m08*m15 - m11*m12) + m07 * (m08*m13 - m09*m12),
        n3 =  m04 * (m09*m14 - m10*m13) - m05 * (m08*m14 - m10*m12) + m06 * (m08*m13 - m09*m12),  
              
        invDet = 1/(m00*n0 - m01*n1 + m02*n2 - m03*n3);
    
    m[0]  =  n0*invDet;
    m[1]  = -n1*invDet;
    m[2]  =  n2*invDet;
    m[3]  = -n3*invDet;     
    
    m[4]  = -(m01 * (m10*m15 - m11*m14) - m02 * (m09*m15 - m11*m13) + m03 * (m09*m14 - m10*m13))*invDet;  
    m[5]  =  (m00 * (m10*m15 - m11*m14) - m02 * (m08*m15 - m11*m12) + m03 * (m08*m14 - m10*m12))*invDet;
    m[6]  = -(m00 * (m09*m15 - m11*m13) - m01 * (m08*m15 - m11*m12) + m03 * (m08*m13 - m09*m12))*invDet;
    m[7]  =  (m00 * (m09*m14 - m10*m13) - m01 * (m08*m14 - m10*m12) + m02 * (m08*m13 - m09*m12))*invDet;
    
    m[8]  =  (m01 * (m06*m15 - m07*m14) - m02 * (m05*m15 - m07*m13) + m03 * (m05*m14 - m06*m13))*invDet;
    m[9]  = -(m00 * (m06*m15 - m07*m14) - m02 * (m04*m15 - m07*m12) + m03 * (m04*m14 - m06*m12))*invDet;
    m[10] =  (m00 * (m05*m15 - m07*m13) - m01 * (m04*m15 - m07*m12) + m03 * (m04*m13 - m05*m12))*invDet;
    m[11] = -(m00 * (m05*m14 - m06*m13) - m01 * (m04*m14 - m06*m12) + m02 * (m04*m13 - m05*m12))*invDet;
    
    m[12] = -(m01 * (m06*m11 - m07*m10) - m02 * (m05*m11 - m07*m09) + m03 * (m05*m10 - m06*m09))*invDet;
    m[13] =  (m00 * (m06*m11 - m07*m10) - m02 * (m04*m11 - m07*m08) + m03 * (m04*m10 - m06*m08))*invDet;
    m[14] = -(m00 * (m05*m11 - m07*m09) - m01 * (m04*m11 - m07*m08) + m03 * (m04*m09 - m05*m08))*invDet;
    m[15] =  (m00 * (m05*m10 - m06*m09) - m01 * (m04*m10 - m06*m08) + m02 * (m04*m09 - m05*m08))*invDet; 

    return this;
  },
  inverseFast:function(){
    var m = this.elements, 
        m00 = m[0],  m04 = m[4],  m08 = m[8],  m12 = m[12],
        m01 = m[1],  m05 = m[5],  m09 = m[9],  m13 = m[13],
        m02 = m[2],  m06 = m[6],  m10 = m[10], m14 = m[14],
        m03 = m[3],  m07 = m[7],  m11 = m[11], m15 = m[15];
    
    
    var a0813 = m08 * m13, a0814 = m08 * m14, a0815 = m08 * m15,
        a0912 = m09 * m12, a0914 = m09 * m14, a0915 = m09 * m15,
        a1012 = m10 * m12, a1013 = m10 * m13, a1015 = m10 * m15,
        a1112 = m11 * m12, a1113 = m11 * m13, a1114 = m11 * m14;
        
    var n0 =  m05 * (a1015 - a1114) - m06 * (a0915 - a1113) + m07 * (a0914 - a1013),
        n1 =  m04 * (a1015 - a1114) - m06 * (a0815 - a1112) + m07 * (a0814 - a1012),
        n2 =  m04 * (a0915 - a1113) - m05 * (a0815 - a1112) + m07 * (a0813 - a0912),
        n3 =  m04 * (a0914 - a1013) - m05 * (a0814 - a1012) + m06 * (a0813 - a0912),  
              
        invDet = 1/(m00*n0 - m01*n1 + m02*n2 - m03*n3);
    
    m[0]  =  n0*invDet;
    m[1]  = -n1*invDet;
    m[2]  =  n2*invDet;
    m[3]  = -n3*invDet;     
    
    m[4]  = -(m01 * (a1015 - a1114) - m02 * (a0915 - a1113) + m03 * (a0914 - a1013))*invDet;  
    m[5]  =  (m00 * (a1015 - a1114) - m02 * (a0815 - a1112) + m03 * (a0814 - a1012))*invDet;
    m[6]  = -(m00 * (a0915 - a1113) - m01 * (a0815 - a1112) + m03 * (a0813 - a0912))*invDet;
    m[7]  =  (m00 * (a0914 - a1013) - m01 * (a0814 - a1012) + m02 * (a0813 - a0912))*invDet;
    
    m[8]  =  (m01 * (m06*m15 - m07*m14) - m02 * (m05*m15 - m07*m13) + m03 * (m05*m14 - m06*m13))*invDet;
    m[9]  = -(m00 * (m06*m15 - m07*m14) - m02 * (m04*m15 - m07*m12) + m03 * (m04*m14 - m06*m12))*invDet;
    m[10] =  (m00 * (m05*m15 - m07*m13) - m01 * (m04*m15 - m07*m12) + m03 * (m04*m13 - m05*m12))*invDet;
    m[11] = -(m00 * (m05*m14 - m06*m13) - m01 * (m04*m14 - m06*m12) + m02 * (m04*m13 - m05*m12))*invDet;
    
    m[12] = -(m01 * (m06*m11 - m07*m10) - m02 * (m05*m11 - m07*m09) + m03 * (m05*m10 - m06*m09))*invDet;
    m[13] =  (m00 * (m06*m11 - m07*m10) - m02 * (m04*m11 - m07*m08) + m03 * (m04*m10 - m06*m08))*invDet;
    m[14] = -(m00 * (m05*m11 - m07*m09) - m01 * (m04*m11 - m07*m08) + m03 * (m04*m09 - m05*m08))*invDet;
    m[15] =  (m00 * (m05*m10 - m06*m09) - m01 * (m04*m10 - m06*m08) + m02 * (m04*m09 - m05*m08))*invDet; 

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
    
    m[0] = m00 * c + m02 * -s; m[1] = m01 * c + m09 * -s; m[2] = m02 * c + m10* -s; m[3] = m03 * c + m11* -s;
    
    m[8] = m00 * s + m02 * c; m[9] = m01 * s + m09 * c; m[10]= m02 * s + m10* c; m[11] = m03 * s + m11* c;    

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
    
    m[0] = m[0]*x;  m[4] = m[4]*y;  m[8] = m[8]*z;         
    m[1] = m[1]*x;  m[5] = m[5]*y;  m[9] = m[9]*z;
    m[2] = m[2]*x;  m[6] = m[6]*y;  m[10]= m[10]*z;
    m[3] = m[3]*x;  m[7] = m[7]*y;  m[11]= m[11]*z;   
    
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
    return '01: '+e[0].toFixed(3)+', 04: '+e[4].toFixed(3)+', 08: '+e[8].toFixed(3)+', 12: '+e[12].toFixed(3) + '\n' + 
           '02: '+e[1].toFixed(3)+', 05: '+e[5].toFixed(3)+', 09: '+e[9].toFixed(3)+', 13: '+e[13].toFixed(3) + '\n' + 
           '03: '+e[2].toFixed(3)+', 06: '+e[6].toFixed(3)+', 10: '+e[10].toFixed(3)+', 14: '+e[14].toFixed(3) + '\n' + 
           '04: '+e[3].toFixed(3)+', 07: '+e[7].toFixed(3)+', 11: '+e[11].toFixed(3)+', 15: '+e[15].toFixed(3);
  }
};

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
  var f = N3D_M_Vector3.Sub(eye,target).normalize(),
      s = N3D_M_Vector3.Cross(up,f).normalize(),
      u = N3D_M_Vector3.Cross(f,s); 
      
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
  /*var xx2 = 2*x*x, yy2 = 2*y*y, zz2 = 2*z*z;
  
  return new N3D_M_Matrix4(
    1-yy2 - zz2, 2*x*y - 2*z*w, 2*x*z + 2*y*w, 0,
    2*x*y + 2*z*w, 1-xx2 - zz2, 2*y*z - 2*x*w, 0,
    2*x*z - 2*y*w, 2*y*z + 2*x*w, 1-xx2 - yy2, 0,
    0,0,0,1 
  
  ); */
};
/* <<<< Math.Matrix4 <<<< */


/* >>>> Math.Vector2 >>>> */
N3D.Math.Vector2 = function(x,y){
  this.x = x;
  this.y = y;

  return this;
};
N3D.Math.Vector2.prototype = {
  constructor:N3D.Math.Vector2,
  xy:function(){
    return [this.x,this.y];
  },
  clone:function(){
    return new N3D_M_Vector2(this.x,this.y);
  },
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
  multiply:function(v){
    this.x *= v.x;
    this.y *= v.y;
    
    return this;  
  },
  multiplyScalar:function(n){
    this.x *= n;
    this.y *= n;
    
    return this;
  },
  normalize:function(){
    var x = this.x,y = this.y;
    var length = Math.sqrt(x*x + y*y);
    
    this.x /= length;
    this.y /= length;
    
    return this; 
  },
  perpendicular:function(){
   var x = this.x,y = this.y;
   var scale_factor = 1 / Math.sqrt(x*x + y*y);
   
   this.x = -1 * y;
   this.y = x;
   
   return this;
  },
  divide:function(v){
    this.x /= v.x;
    this.y /= v.y;
    
    return this;  
  },
  divideScalar:function(n){
    this.x /= n;
    this.y /= n;
    
    return this;
  },
  rotate:function(angle){
    var x = this.x, y = this.y;
    
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    
    this.x = x*cos - y*sin;
    this.y = x*sin + y*cos;
    
    return this;
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y);
  },
  toString:function(){
    return "N3D.Math.Vector2("+this.x+","+this.y+")";
  },
  negative:function(){
    return this.scale(-1);
  },
  equals:function(v){
    return (this.x == v.x && this.y == v.y);
  },
  distance:function(v){
    var x = this.x-v.x;
    var y = this.y-v.y;
    return Math.sqrt(x*x + y*y);
  }  
};
N3D.Math.Vector2.Equals = function(v1,v2){
  return (v1.x == v2.x && v1.y == v2.y);
};
N3D.Math.Vector2.Identity = function(){
  return new N3D_M_Vector2(0,0);
};
N3D.Math.Vector2.Add = function(v1,v2){
  return new N3D_M_Vector2(v2.x+v1.x,v2.y+v1.y);
};

N3D.Math.Vector2.MultiplyScalar = function(v,n){
  return new N3D_M_Vector2(v.x*n,v.y*n);
};
N3D.Math.Vector2.Dot = function(v1, v2){
  return (v1.x*v2.x + v1.y*v2.y);
};
N3D.Math.Vector2.Sub = function(v1,v2){
  return new N3D_M_Vector2(v1.x-v2.x,v1.y-v2.y);
};
N3D.Math.Vector2.Distance = function(v1,v2){
  var x = v1.x-v2.x, y = v1.y-v2.y;
  return Math.sqrt(x*x+y*y);
};
N3D.Math.Vector2.Cross = function(v1,v2){
  return new N3D_M_Vector2(
    v1.x*v2.y - v1.y*v2.x,
    v2.x*v1.y - v2.y*v1.x
  );
};

N3D.Math.Vector2.Lerp = function(v1,v2,a){
  return new N3D_M_Vector2(
    v1.x + (v2.x-v1.x) * a,
    v1.y + (v2.y-v1.y) * a,
    v1.z + (v2.z-v1.z) * a
  );
};

/* <<<< Math.Vector2 <<<< */

/* >>>> Math.Vector3 >>>> */
N3D.Math.Vector3 = function(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
  
  return this;
};
N3D.Math.Vector3.prototype = {
  constructor:N3D.Math.Vector3,
  clone:function(){
    return new N3D_M_Vector3(this.x,this.y,this.z);
  },
  xyz:function(){
    return [this.x,this.y,this.z];
  },
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
  multiplyScalar:function(n){
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
    var length = 1/Math.sqrt(x*x + y*y + z*z);
    
    this.x *= length;
    this.y *= length;
    this.z *= length;
    
    return this; 
  },
  negative:function(){
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  },
  rotateY:function(angle){
    var x = this.x, z = this.z;
    
    var c = Math.cos(angle),
        s = Math.sin(angle);
    
    this.x = z*s + x*c;
    this.z = z*c - x*s;    
    
    return this;
  },
  rounded:function(){
    this.x = ~~this.x;
    this.y = ~~this.y;
    this.z = ~~this.z;
    
    return this;
  },
  toRotationMatrix:function(r){
    var c = Math.cos(r), s = Math.sin(r);
    
    var x = this.x, y = this.y, z = this.z, t = 1-c,
        xyt = x*y*t, xzt = x*z*t, yzt = y*z*t,
        xs = x*s, ys = y*s, zs = z*s;


    return new N3D_M_Matrix4(
      c+x*x*t, xyt-zs,  xzt+ys,  0,
      xyt+zs,  c+y*y*t,  yzt-xs,  0,
      xzt-ys,  yzt+xs,  c+z*z*t,  0,
      0,        0,        0,        1
    );
  },
  toVector4:function(n){
    return new N3D_M_Vector4(this.x,this.y,this.z,n);
  },
  toString:function(){
    return "N3D.Math.Vector3("+this.x+","+this.y+","+this.z+")";
  }
};
N3D.Math.Vector3.Perp = function(a,axis){
  var x = a.x, y = a.y, z = a.z;
  var par = N3D_M_Vector3.Parallel(a,axis);
  return new N3D_M_Vector3(
    x-par.x,
    y-par.y,
    z-par.z  
  );
};
N3D.Math.Vector3.Parallel = function(a,axis){
  var dot = N3D_M_Vector3.Dot(a,axis);
  var p = axis.clone();
  
  return new N3D_M_Vector3(
    axis.x*dot, axis.y*dot, axis.z*dot
  ); 
};
N3D.Math.Vector3.Identity = function(){
  return new N3D_M_Vector3(0,0,0);
};
N3D.Math.Vector3.Up = new N3D.Math.Vector3(0,1,0);
N3D.Math.Vector3.Right = new N3D.Math.Vector3(1,0,0);
N3D.Math.Vector3.Forward = new N3D.Math.Vector3(0,0,-1);

N3D.Math.Vector3.Lerp = function(v1,v2,a){
  var Lerp = N3D_M.Lerp;

  return new N3D_M_Vector3(
    Lerp(v1.x, v2.x, a),
    Lerp(v1.y, v2.y, a),
    Lerp(v1.z, v2.z, a)
  );
};
N3D.Math.Vector3.Max = function(v1,v2){
  return newN3D_M_Vector3(
    N3D_M.Max(v1.x, v2.x),
    N3D_M.Max(v1.y, v2.y),
    N3D_M.Max(v1.z, v2.z)
  );
};
N3D.Math.Vector3.Min = function(v1,v2){
  return new N3D_M_Vector3(
    N3D_M.Min(v1.x, v2.x),
    N3D_M.Min(v1.y, v2.y),
    N3D_M.Min(v1.z, v2.z)
  );
};
N3D.Math.Vector3.Herminte = function(v1,t1,v2,t2,a){
  return new N3D_M_Vector3(
    N3D_M.Hermite(v1.x, t1.x, v2.x, t2.x, a),
    N3D_M.Hermite(v1.y, t1.y, v2.y, t2.y, a),
    N3D_M.Hermite(v1.z, t1.z, v2.z, t2.z, a)
  );   
};
N3D.Math.Vector3.isZero = function(v){
  return (v.x == 0 && v.y == 0 && v.z==0);
};
N3D.Math.Vector3.Equals = function(v){
  return v instanceof N3D_M_Vector3;
};
N3D.Math.Vector3.DistanceSquared = function(v1,v2){
  return (v1.x-v2.x) * (v1.x-v2.x) + (v1.y-v2.y) * (v1.y-v2.y) + (v1.z-v2.z) * (v1.z-v2.z); 
};
N3D.Math.Vector3.Distance = function(v1,v2){
  return Math.sqrt((v1.x-v2.x) * (v1.x-v2.x) + (v1.y-v2.y) * (v1.y-v2.y) + (v1.z-v2.z) * (v1.z-v2.z));
};
N3D.Math.Vector3.Cross = function(v1, v2){
  return new N3D_M_Vector3(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x  
  );
};
N3D.Math.Vector3.BaryCentric = function(v1,v2,v3,a1,a2,r){
  return new N3D_M_Vector3(
    N3D_M.Barycentric(v1.x, v2.x, v3.x, a1, a2),
    N3D_M.Barycentric(v1.y, v2.y, v3.y, a1, a2),
    N3D_M.Barycentric(v1.z, v2.z, v3.z, a1, a2)
  );
};

N3D.Math.Vector3.CatmullRom = function(v1,v2,v3,v4,a,r){
  return new N3D_M_Vector3(
    N3D_M.CatmullRom(v1.x, v2.x, v3.x, v4.x, a),
    N3D_M.CatmullRom(v1.y, v2.y, v3.y, v4.y, a),
    N3D_M.CatmullRom(v1.z, v2.z, v3.z, v4.z, a)
  );
};

N3D.Math.Vector3.Clamp = function(v1, min, max){
  return new N3D_M_Vector3(
    N3D_M.Clamp(v1.x, min.x, max.x),
    N3D_M.Clamp(v1.y, min.y, max.y),
    N3D_M.Clamp(v1.z, min.z, max.z)
  );
};
N3D.Math.Vector3.Dot = function(v1, v2){
  return (v1.x*v2.x + v1.y*v2.y + v1.z * v2.z);
};
N3D.Math.Vector3.Reflect = function(v,n){
  var dT = 2 * N3D_M_Vector3.Dot(v,n);
  return new N3D_M_Vector3(
    v.x - dT * n.x,
    v.y - dT * n.y,
    v.z - dT * n.z
  );
};
N3D.Math.Vector3.Add = function(v0,v1){
  return new N3D_M_Vector3(
    v0.x+v1.x,
    v0.y+v1.y,
    v0.z+v1.z  
  );
};

N3D.Math.Vector3.Sub = function(v0,v1){
  return new N3D_M_Vector3(
    v0.x-v1.x,
    v0.y-v1.y,
    v0.z-v1.z  
  );
};
N3D.Math.Vector3.MultiplyScalar = function(v0,n){
  return new N3D_M_Vector3(
    v0.x*n,
    v0.y*n,
    v0.z*n  
  );
};

N3D.Math.Vector3.SmoothStep = function(v1,v2,a){
  return new N3D_M_Vector3(
    N3D_M.SmoothStep(v1.x, v2.x, a),
    N3D_M.SmoothStep(v1.y, v2.y, a),
    N3D_M.SmoothStep(v1.z, v2.z, a)
  );
};

N3D_M_Vector3 = N3D.Math.Vector3;
/* <<<< Math.Vector3 <<<< */

/* >>>> Math.Vector4 >>>> */
N3D.isLoaded = true;

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
    return new N3D.Math.Vector4(this.x,this.y,this.z,this.w);
  },
  xyz:function(){
    return [this.x,this.y,this.z];
  },
  xyzw:function(){
    return [this.x,this.y,this.z,this.w];
  },
  add:function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    
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
  multiplyScalar:function(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
    this.w *= n;
    
    return this;
  },
  divide:function(v){
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    
    return this;
  },
  divideScalar:function(n){
    return this.multiplyScalar(1/n);
  },
  dot:function(v){
    return (this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w);
  },
  normalize:function(){
    var x = this.x, y = this.y, z = this.z, w = this.w;
    var f = 1/Math.sqrt(x*x+y*y+z*z+w*w);
    this.x *= f;
    this.y *= f;
    this.z *= f;
    this.w *= f;
    
    return this;
  },
  length:function(){
    var x = this.x, y = this.y, z = this.z, w = this.w;
    return Math.sqrt(x*x+y*y+z*z+w*w);
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
  copyFromVector4:function(o){
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    this.w = o.w;
    
    return this;
  },
  toHomogenous: function(width,height){
    var invW = 1/this.w;
    
    var x = this.x*invW,
        y = this.y*invW,
        z = this.z*invW;

    if(-1 < x && x < 1 && -1 < y && y < 1 && -1 < z && z < 1){
      this.x = ~~((x+1)*(width*0.5)); 
      this.y = ~~((y+1)*(height*0.5));
      this.z = z; 
      this.draw = true;
      return this;  
    }
  
    this.draw = false;
    
    return false;
  },
  toString:function(){
    return "N3D.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";
  }
};
N3D.Math.Vector4.Identity = function(){
  return new this(0,0,0,1);
};
N3D.Math.Vector4.CreateFromVector3 = function(v,n){
  return new this(v.x,v.y,v.z,n);
};

N3D.Math.Vector4.Lerp = function(v1,v2,a){
  var Lerp = N3D_M.Lerp;

  return new $V4(
    Lerp(v1.x, v2.x, a),
    Lerp(v1.y, v2.y, a),
    Lerp(v1.z, v2.z, a),
    Lerp(v1.w, v2.w, a)
  );
};

N3D.Math.Vector4.Multiply = function(v1,v2){
  return new this(
    v1.x*v2.x,
    v1.y*v2.y,
    v1.z*v2.z,
    v1.w*v2.w
  );
};

N3D.Math.Vector4.Equals = function(v){
  return v instanceof this;
};
N3D.Math.Vector4.Add = function(v1,v2){
  return new this(
    v1.x+v2.x,
    v1.y+v2.y,
    v1.z+v2.z,
    v1.w+v2.w
  );
};
N3D.Math.Vector4.Sub = function(v1,v2){
  return new this(
    v1.x-v2.x,
    v1.y-v2.y,
    v1.z-v2.z,
    v1.w-v2.w  
  );
};

N3D.Math.Vector4.Projection = function(p,viewport){
  var viewport = viewport || $Game.viewport;
  p.divideNumber(p.w);
  var w = 1;
  
  if(-w <= p.x <= w && -w <= p.y <= w && -w <= p.z <= w){
    var x = (p.x+1)*(viewport.width*0.5); 
    var y = (p.y+1)*(viewport.height*0.5);
    var v = new $V2(~~x,~~y);
    v.z = p.z;
    return v;  
  }
  
  return false;
}; 
/* <<<< Math.Vector4 <<<< */

N3D_M = N3D.Math;
N3D_M_Matrix4 = N3D.Math.Matrix4; 
N3D_M_Matrix3 = N3D.Math.Matrix3;
N3D_M_Vector2 = N3D.Math.Vector2;
N3D_M_Vector3 = N3D.Math.Vector3; 
N3D_M_Vector4 = N3D.Math.Vector4; 