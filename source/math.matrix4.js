/*
Vector - row
Matrix4 - right-handed
0,1,2,3,
4,5,6,7,
8,9,10,11,
12,13,14,15

RotateX:
1,0,0,
0,c,-s,
0,s,c

RotateY:
c,0,s,
0,1,0,
-s,0,c

RotateZ:
c,-s,0,
s,c,0,
0,0,1

Vector representation:
Lx,Ux,Fx,Tx,
Ly,Uy,Fy,Ty,
Lz,Uz,Fz,Tz,
Lw,Uw,Fw,Tw 
*/
N3D.Math.Matrix4 = function(n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15){
  if(typeof n15 !== "undefined"){
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
N3D.Math.Matrix4.prototype = {
  constructor:N3D.Math.Matrix4,
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
  inverse2:function(){
    var m = this.m, 
        i00 = m[0], i01 = m[4], i02 = m[8], i03 = m[12],
        i10 = m[1], i11 = m[5], i12 = m[9], i13 = m[13],
        i20 = m[2], i21 = m[6], i22 = m[10], i23 = m[14],
        i30 = m[3], i31 = m[7], i32 = m[11], i33 = m[15];

    var s0 = i00 * i11 - i10 * i01,
        s1 = i00 * i12 - i10 * i02,
        s2 = i00 * i13 - i10 * i03,
        s3 = i01 * i12 - i11 * i02,
        s4 = i01 * i13 - i11 * i03,
        s5 = i02 * i13 - i12 * i03,

        c5 = i22 * i33 - i32 * i23,
        c4 = i21 * i33 - i31 * i23,
        c3 = i21 * i32 - i31 * i22,
        c2 = i20 * i33 - i30 * i23,
        c1 = i20 * i32 - i30 * i22,
        c0 = i20 * i31 - i30 * i21,
    
        invdet = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);
    
    m[0] = (i11 * c5 - i12 * c4 + i13 * c3) * invdet;
    m[1] = (-i10 * c5 + i12 * c2 - i13 * c1) * invdet;
    m[2] = (i10 * c4 - i11 * c2 + i13 * c0) * invdet;
    m[3] = (-i10 * c3 + i11 * c1 - i12 * c0) * invdet;
    
    m[4] = (-i01 * c5 + i02 * c4 - i03 * c3) * invdet;
    m[5] = (i00 * c5 - i02 * c2 + i03 * c1) * invdet;
    m[6] = (-i00 * c4 + i01 * c2 - i03 * c0) * invdet;
    m[7] = (i00 * c3 - i01 * c1 + i02 * c0) * invdet;    
    
    m[8] = (i31 * s5 - i32 * s4 + i33 * s3) * invdet;
    m[9] = (-i30 * s5 + i32 * s2 - i33 * s1) * invdet;
    m[10] = (i30 * s4 - i31 * s2 + i33 * s0) * invdet;
    m[11] = (-i30 * s3 + i31 * s1 - i32 * s0) * invdet;
    
    m[12] = (-i21 * s5 + i22 * s4 - i23 * s3) * invdet;
    m[13] = (i20 * s5 - i22 * s2 + i23 * s1) * invdet;
    m[14] = (-i20 * s4 + i21 * s2 - i23 * s0) * invdet;
    m[15] = (i20 * s3 - i21 * s1 + i22 * s0) * invdet;

    /////doděálat aby to fungovalo
    return this;
  },
  multiply:function(n){
    var m = this.m, 
        m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
        m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
        m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11],
        m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15],
        n0 = n.m[0], n1 = n.m[1], n2 = n.m[2], n3 = n.m[3],
        n4 = n.m[4], n5 = n.m[5], n6 = n.m[6], n7 = n.m[7],
        n8 = n.m[8], n9 = n.m[9], n10 = n.m[10], n11 = n.m[11],
        n12 = n.m[12], n13 = n.m[13], n14 = n.m[14], n15 = n.m[15];
        
    m[0] = m0*n0 + m1*n4 + m2*n8 + m3*n12;
    m[1] = m0*n1 + m1*n5 + m2*n9 + m3*n13;
    m[2] = m0*n2 + m1*n6 + m2*n10 + m3*n14;
    m[3] = m0*n3 + m1*n7 + m2*n11 + m3*n15;
      
    m[4] = m4*n0 + m5*n4 + m6*n8 + m7*n12;
    m[5] = m4*n1 + m5*n5 + m6*n9 + m7*n13;
    m[6] = m4*n2 + m5*n6 + m6*n10 + m7*n14;
    m[7] = m4*n3 + m5*n7 + m6*n11 + m7*n15;
      
    m[8] = m8*n0 + m9*n4 + m10*n8 + m11*n12;
    m[9] = m8*n1 + m9*n5 + m10*n9 + m11*n13;
    m[10] = m8*n2 + m9*n6 + m10*n10 + m11*n14;
    m[11] = m8*n3 + m9*n7 + m10*n11 + m11*n15;
      
    m[12] = m12*n0 + m13*n4 + m14*n8 + m15*n12;
    m[13] = m12*n1 + m13*n5 + m14*n9 + m15*n13;
    m[14] = m12*n2 + m13*n6 + m14*n10 + m15*n14;
    m[15] = m12*n3 + m13*n7 + m14*n11 + m15*n15;      

    return this;
  },
  multiplyVector4:function(v){
    var m = this.m;
    var x = v.x, y = v.y, z = v.z,w = v.w;

    return new $V4(
      m[0] * x + m[4] * y + m[8] * z + m[12] * w,
      m[1] * x + m[5] * y + m[9] * z + m[13] * w,
      m[2] * x + m[6] * y + m[10] * z + m[14] * w,
      m[3] * x + m[7] * y + m[11] * z + m[15] * w   
    );
  },
  transpose:function(){
    var m = this.m;
    var a01 = m[1], a02 = m[2], a03 = m[3];
    var a12 = m[6], a13 = m[7];
    var a23 = m[11];
                
    m[1] = m[4]; m[2] = m[8]; m[3] = m[12];
    m[4] = a01;  m[6] = m[9]; m[7] = m[13];
    m[8] = a02;  m[9] = a12;  m[11] = m[14];
    m[12] = a03; m[13] = a13; m[14] = a23;
    
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

N3D.Math.Matrix4.Multiply = function(m,n){
  var m0 = m.m[0], m1 = m.m[1], m2 = m.m[2], m3 = m.m[3],
  m4 = m.m[4], m5 = m.m[5], m6 = m.m[6], m7 = m.m[7],
  m8 = m.m[8], m9 = m.m[9], m10 = m.m[10], m11 = m.m[11],
  m12 = m.m[12], m13 = m.m[13], m14 = m.m[14], m15 = m.m[15],
  n0 = n.m[0], n1 = n.m[1], n2 = n.m[2], n3 = n.m[3],
  n4 = n.m[4], n5 = n.m[5], n6 = n.m[6], n7 = n.m[7],
  n8 = n.m[8], n9 = n.m[9], n10 = n.m[10], n11 = n.m[11],
  n12 = n.m[12], n13 = n.m[13], n14 = n.m[14], n15 = n.m[15];
      
  return new this(
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
    m12*n2 + m13*n6 + m14*n10 + m15*n14
  );
};

N3D.Math.Matrix4.Identity = function(){
  return new this(
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1  
  );
};

N3D.Math.Matrix4.CreateRotationX = function(angle){
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return new this(
    1,0,0,0,
    0,c,-s,0,
    0,s,c,0,
    0,0,0,1
  );
};

N3D.Math.Matrix4.CreateRotationY = function(angle){
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return new this(
    c,0,s,0,
    0,1,0,0,
    -s,0,c,0,
    0,0,0,1
  );  
};

N3D.Math.Matrix4.CreateRotationZ = function(angle){
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return new this(
    c,-s,0,0,
    s,c,0,0,
    0,0,1,0,
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
N3D.Math.Matrix4.CreateScale = function(x,y,z){
  return new this(
    x,0,0,0,
    0,y,0,0,
    0,0,z,0,
    0,0,0,1
  );   
};

N3D.Math.Matrix4.CreateRotationAroundAxis = function(angle,v){
  var x = v.x,y = v.y, z = v.z;
  var v = 1/Math.sqrt(x*x + y*y + z*v.z);
  
  var c = Math.cos(angle),    // cosine
      s = Math.sin(angle),    // sine
      x = x*v, y = y*v, z = z*v,
      xy = x * y,
      xz = x * z,
      yz = y * z,
      xs = x * s,
      ys = y * s,
      zs = z * s,      
      t = 1 - c;

  return new this(
    x*x * t + c,xy * t + zs,xz * t - ys,0, 
    xy * t - zs,y*y * t + c,yz * t + xs,0, 
    xz * t + ys,yz * t - xs,z*z * t + c,0, 
    0,0,0,1
  );
};

N3D.Math.Matrix4.CreateFrustum = function(left, right, bottom, top, near, far){
  var near2 = 2*near;
  var rl = right-left,
      tb = top-bottom
      fn = far-near;
      a = near2/rl,
      b = (right+left)/rl,
      c = near2/tb,
      d = (top+bottom)/tb,
      e = -(far+near)/fn,
      f = -(2*far*near)/fn;
  
  return new this(
    a,0,0,0,
    0,c,0,0,
    b,d,e,-1,
    0,0,f,0  
  );
};

N3D.Math.Matrix4.CreatePerspectiveProjection = function(fov,aspect,near,far){
  var ymax = near*Math.tan(fov * N3D.Math.PiOver360);
  var ymin = -ymax;
  var xmin = ymin*aspect;
  var xmax = ymax*aspect;

  return this.CreateFrustum(xmin,xmax,ymin,ymax,near,far);
};

N3D.Math.Matrix4.CreateOrthographicProjection = function(left, right, bottom, top, near, far){
  var rl = right-left,
      tb = top-bottom,
      fn = far-near;
  return new this(
    2/rl,             0,                0,              0,
    0,                2/tb,             0,              0,
    0,                0,                -2/fn,          0,
    -(right+left)/rl, -(top+bottom)/tb, -(far+near)/fn, 1
  );
};
N3D.Math.Matrix4.CreateLookAt = function(eye,center,up){
  var zaxis = $V3.Sub(eye,center).normalize();
  var xaxis = $V3.Cross(up,zaxis).normalize();
  var yaxis = $V3.Cross(zaxis, xaxis);
  return new this(
    xaxis.x, yaxis.x, zaxis.x, 0,
    xaxis.y, yaxis.y, zaxis.y, 0,
    xaxis.z, yaxis.z, zaxis.z, 0,
    -$V3.Dot(xaxis, eye), -$V3.Dot(yaxis, eye), -$V3.Dot(zaxis, eye), 1
  );
};

$M4 = N3D.Math.Matrix4;
$M4new = N3D.Math.Matrix4new;