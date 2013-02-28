N3D.Math = Math;
N3D.Math.Log10E = 0.4342945;
N3D.Math.Log2E = 1.442695;
N3D.Math.PiOver2 = Math.PI*0.5;
N3D.Math.PiOver4 = Math.PI*0.25;
N3D.Math.TwoPi = Math.PI*2;
N3D.Math.PiOver360 = Math.PI/360;
N3D.Math.PiOver180 = Math.PI/180;


N3D.Math.cot = function(num){
  return 1/Math.tan(num);
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
N3D.Math.Lerp2 = function(a1,a2,b1,b2,a){
  var a = (a-a1)/(a2-a1);  
  return (b1 + a*(b2-b1)); 
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