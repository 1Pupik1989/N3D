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

if(N3D){
  N3D.Math = Maths;
}
