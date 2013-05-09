N3D.Math = (function(n){
  var obj = {};
  var random = n.random;
  var tan = n.tan;
  var PI = Math.PI;
  
  obj.Log10E = 0.4342945;
  obj.Log2E = 1.442695;
  obj.PiOver2 = Math.PI*0.5;
  obj.PiOver4 = Math.PI*0.25;
  obj.TwoPi = Math.PI*2;
  obj.PiOver360 = Math.PI/360;
  obj.PiOver180 = Math.PI/180;
  obj.PI = Math.PI;  
  
  obj.pow2 = function(n){return n*n;};
  obj.pow3 = function(n){return n*n*n;}; 
  obj.randomFloat = function(from,to){
    return random()*(to-from) + from;  
  };
  obj.cot = function(num){
    return 1/tan(num);
  };
  obj.cosDeg = function(angle){
    return Math.cos(angle * Math.PI/180);
  };
  obj.sinDeg = function(angle){
    return Math.sin(angle * Math.PI/180);
  };
  
  return obj;
})(Math);

N3D.Math.FromFibonacci = function(T){
  var root5 = Math.sqrt(5);
  var phi = (1 + root5) / 2;

  var idx  = Math.floor( Math.log(T*root5) / Math.log(phi) + 0.5 );
  var u = Math.floor( Math.pow(phi, idx)/root5 + 0.5);

  return (u == T) ? idx : false;
};
N3D.Math.ToFibonacci = function(T){
  return T<2 ? T : fib(T-1)+fib(T-2);
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

$Math = N3D.Math;