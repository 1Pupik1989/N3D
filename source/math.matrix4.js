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
  clone:function(){
    var M = $M4.Identity();
    M.m = this.m.slice();
    return M;
  },
  identity:function(){
    this.m = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
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
    var m = this.m,
        nm = n.m, 
        m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
        m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
        m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11],
        m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15],
        n0 = nm[0], n1 = nm[1], n2 = nm[2], n3 = nm[3],
        n4 = nm[4], n5 = nm[5], n6 = nm[6], n7 = nm[7],
        n8 = nm[8], n9 = nm[9], n10 = nm[10], n11 = nm[11],
        n12 = nm[12], n13 = nm[13], n14 = nm[14], n15 = nm[15];
        
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
  scale:function(x,y,z){
    var m = this.m;
    m[0] *= x; m[1] *= y; m[2] *= z;
		m[4] *= x; m[5] *= y; m[6] *= z;
		m[8] *= x; m[9] *= y; m[10] *= z;
		m[11] *= x; m[12] *= y; m[13] *= z;  
    
    return this;
  },
  rotateX: function(angle){
    var m = this.m;
    
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    
    var m1 = m[1], m5 = m[5], m9 = m[9],  m13 = m[13],
        m2 = m[2], m6 = m[6], m10= m[10], m14= m[14];

    m[1] = m1 * c + m2 *s;
    m[5] = m5 * c + m6 *s;
    m[9] = m9 * c + m10*s;
    m[13] = m13 * c + m14*s;
    m[2] = m1 * -s + m2 * c;
    m[6] = m5 * -s + m6 * c;
    m[10]= m9 * -s + m10* c;
    m[14]= m13 * -s + m14* c;

    return this;
  },
  rotateY: function(angle){
    var m = this.m;
    
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var m0 = m[0], m4 = m[4], m8 = m[8],  m12 = m[12],
        m2 = m[2], m6 = m[6], m10= m[10], m14= m[14];
    
    m[0] = m0 * c + m2 * -s;
    m[4] = m4 * c + m6 * -s;
    m[8] = m8 * c + m10* -s;
    m[12] = m12 * c + m14* -s;
    m[2] = m0 *s + m2 * c;
    m[6] = m4 *s + m6 * c;
    m[10]= m8 *s + m10* c;
    m[14]= m12 *s + m14* c;
    

    return this;
  },
  rotateZ: function(angle){
    var m = this.m;
    
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var m0 = m[0], m4 = m[4], m8 = m[8],  m12 = m[12],
        m1 = m[1], m5 = m[5], m9 = m[9],  m13 = m[13];

    m[0] = m0 * c + m1 *s;
    m[4] = m4 * c + m5 *s;
    m[8] = m8 * c + m9 *s;
    m[12] = m12 * c + m13 *s;
    m[1] = m0 * -s + m1 * c;
    m[5] = m4 * -s + m5 * c;
    m[9] = m8 * -s + m9 * c;
    m[13] = m12 * -s + m13 * c;

    return this;
  },
  rotateAroundAxis:function(angle,v){
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
        
    var m = this.m,
        m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
        m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
        m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11],
        m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15],
        n0 = x*x * t + c, n1 = xy * t + zs, n2 = xz * t - ys,
        n4 = xy * t - zs, n5 = y*y * t + c, n6 = yz * t + xs,
        n8 = xz * t + ys, n9 = yz * t - xs, n10 = z*z * t + c;

    m[0] = m0*n0 + m1*n4 + m2*n8;
    m[1] = m0*n1 + m1*n5 + m2*n9;
    m[2] = m0*n2 + m1*n6 + m2*n10;
    
    m[4] = m4*n0 + m5*n4 + m6*n8;
    m[5] = m4*n1 + m5*n5 + m6*n9;
    m[6] = m4*n2 + m5*n6 + m6*n10;
    
    m[8] = m8*n0 + m9*n4 + m10*n8;
    m[9] = m8*n1 + m9*n5 + m10*n9;
    m[10] = m8*n2 + m9*n6 + m10*n10;
     
    return this;
  },
  translate:function(v){
    var m = this.m, 
        m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15],
        x = v.x,y = v.y,z = v.z,w = 1;

    m[0]  += m12*x;   m[1]  += m12*y;   m[2]  += m12*z;
    m[4]  += m13*x;   m[5]  += m13*y;   m[6]  += m13*z;
    m[8]  += m14*x;   m[9]  += m14*y;   m[10] += m14*z;
    m[12] += m15*x;   m[13] += m15*y;   m[14] += m15*z;

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
  var m = m.m, n = n.m,   
  m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
  m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
  m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11],
  m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15],
  n0 = n[0], n1 = n[1], n2 = n[2], n3 = n[3],
  n4 = n[4], n5 = n[5], n6 = n[6], n7 = n[7],
  n8 = n[8], n9 = n[9], n10 = n[10], n11 = n[11],
  n12 = n[12], n13 = n[13], n14 = n[14], n15 = n[15];
      
  return new N3D.Math.Matrix4(
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
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    x,y,z,1
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
  var v = 1/Math.sqrt(x*x + y*y + z*v.z),
      c = Math.cos(angle),
      s = Math.sin(angle),   
      t = 1 - c;
      
  x *= v; y *= v; z *= v;
  
  return new this(
    x*x * t + c,x*y * t + z*s,x*z * t - y*s,0, 
    x*y * t - z*s,y*y * t + c,y*z * t + x*s,0, 
    x*z * t + y*s,y*z * t - x*s,z*z * t + c,0, 
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

N3D.Math.Matrix4.CreateFromQuaternion = function(q){
  var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  var sqw = qw*qw;
  var sqx = qx*qx;
  var sqy = qy*qy;
  var sqz = qz*qz;

  var invs = 1 / (sqx + sqy + sqz + sqw);
  
  var tmp1 = qx*qy, tmp2 = qz*qw, tmp3 = qx*qz,
      tmp4 = qy*qw, tmp5 = qy*qz, tmp6 = qx*qw;

  return new this(
    ( sqx - sqy - sqz + sqw)*invs,  2 * (tmp1 - tmp2)*invs,       2 * (tmp3 + tmp4)*invs,     0,
    2 * (tmp1 + tmp2)*invs,       (-sqx + sqy - sqz + sqw)*invs,  2 * (tmp5 - tmp6)*invs,     0,
    2 * (tmp3 - tmp4)*invs,       2 * (tmp5 + tmp6)*invs,       (-sqx - sqy + sqz + sqw)*invs,0,
    0,0,0,1  
  );
};

N3D.Math.Matrix4.CreateBias = function(){
  return new this(
    0.5, 0.0, 0.0, 0.0,
    0.0, 0.5, 0.0, 0.0,
    0.0, 0.0, 0.5, 0.0,
    0.5, 0.5, 0.5, 1.0
  );
};
N3D.Math.Matrix4.CreateShadow = function(plane,light){
  var px = plane.x, py = plane.y, pz = plane.z, pw = plane.w,
      lx = light.x, ly = light.y, lz = light.z, lw = light.w;
  
  var dot = px * lx + py * ly + pz * lz + pw * lw,
  
  m0 = dot - lx * px,
  m4 = -lx * py,
  m8 = -lx * pz,
  m12 = -lx * pw,

  m1 = -ly * px,
  m5 = dot - ly * py,
  m9 = -ly * pz,
  m13 = -ly * pw,

  m2 = -lz * px,
  m6 = -lz * py,
  m10 = dot - lz * pz,
  m14 = -lz * pw,

  m3 = -lw * px,
  m7 = -lw * py,
  m11 = -lw * pz,
  m15 = dot - lw * pw;
        
  return new this(
    m0,m1,m2,m3,
    m4,m5,m6,m7,
    m8,m9,m10,m11,
    m12,m13,m14,m15    
  );
};

$M4 = N3D.Math.Matrix4;