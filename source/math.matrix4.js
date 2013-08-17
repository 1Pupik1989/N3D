N3D.isLoaded = true;
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
var $M4 = N3D.Math.Matrix4 = function(a00,a04,a08,a12,
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
  return new this(
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
      
  return new this(
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
    
  return new this(        
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
  var f = $V3.Sub(eye,target).normalize();   //osa Z
  var s = $V3.Cross(up,f).normalize();   //osa X
  var u = $V3.Cross(f,s);   //osa Y
  
  return new this(
    s.x,  u.x,  f.x,  -eye.x,
    s.y,  u.y,  f.y,  -eye.y,
    s.z,  u.z,  f.z,  -eye.z,
    0,    0,    0,    1 
  );
};

N3D.Math.Matrix4.CreateRotationX = function(r){
  var c = Math.cos(r);
  var s = Math.sin(r);
  
  return new this(
    1,0,0,0,
    0,c,-s,0,
    0,s,c,0,
    0,0,0,1
  );
};


N3D.Math.Matrix4.CreateRotationY = function(r){
  var c = Math.cos(r);
  var s = Math.sin(r);
  
  return new this(
    c,0,s,0,
    0,1,0,0,
    -s,0,c,0,
    0,0,0,1
  );
};
N3D.Math.Matrix4.CreateRotationZ = function(r){
  var c = Math.cos(r);
  var s = Math.sin(r);
  
  return new this(
    c,-s,0,0,
    s,c,0,0,
    0,0,1,0,
    0,0,0,1
  );
};


N3D.Math.Matrix4.CreateScale = function(x,y,z){
  return new this(
    x,0,0,0,
    0,y,0,0,
    0,0,z,0,
    0,0,0,1
  );
};

N3D.Math.Matrix4.CreateTranslation = function(x,y,z){
  return new this(
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
  return new this(
    n2/rl,            0,                0,                0,
    0,                n2/tb,            0,                0,
    (right+left)/rl,  (top+bottom)/tb,  -(far+near)/fn,   -1,
    0,                0,                -n2*far/fn,         0
  );
};

N3D.Math.Matrix4.CreatePerspective = function(angle,aspectRatio,near,far){
  var scale = Math.tan(angle * $Math.PiOver360) * near,
      right = aspectRatio * scale;

  return this.CreateFrustum(-right,right,-scale,scale,near,far);
};

N3D.Math.Matrix4.CreateOrthographic = function(l,r,b,t,n,f){
  var rl = (r - l),
	    tb = (t - b),
	    fn = (f - n);
  
  return new this(
    2/rl,       0,          0,          0,
    0,          2/tb,       0,          0,
    0,          0,          -2/fn,      0,
    -(l+r)/rl,  -(t+b)/tb,  -(f+n)/fn,  1
  );
};