N3D.Physics = {};

/* >>>> Physics.Collision >>>> */
N3D.Physics.Collision = {};

N3D.Physics.Collision.PointInTriangle2D = function(t,p){
  var vp0 = t.vp0, vp1 = t.vp1, vp2 = t.vp2;

  var v0x = vp2.x - vp0.x,
      v0y = vp2.y - vp0.y,
      v1x = vp1.x - vp0.x,
      v1y = vp1.y - vp0.y,
      v2x = p.x - vp0.x,
      v2y = p.y - vp0.y;                    

  var dot00 = v0x*v0x + v0y*v0y,
      dot01 = v0x*v1x + v0y*v1y,
      dot02 = v0x*v2x + v0y*v2y,
      dot11 = v1x*v1x + v1y*v1y,
      dot12 = v1x*v2x + v1y*v2y;

  var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

  var u = (dot11 * dot02 - dot01 * dot12) * invDenom,
      v = (dot00 * dot12 - dot01 * dot02) * invDenom;

return ((u >= 0) && (v >= 0) && (u + v < 1));  
};

N3D.Physics.Collision.PointInTriangle2D2 = function(t,p){
  var x = p.x;
  var y = p.y;

  var vp0 = t.vp0, x1 = vp0.x, y1 = vp0.y;
  var vp1 = t.vp1, x2 = vp1.x, y2 = vp1.y;
  var vp2 = t.vp2, x3 = vp2.x, y3 = vp2.y;

  var fAB = (y-y1) * (x2-x1) - (x-x1) * (y2-y1);
  var fBC = (x-x2) * (x3-x2) - (x-x2) * (y3-y2);
  var fCA = (y-y3) * (x1-x3) - (x-x3) * (y1-y3);

  return (fAB*fBC>0 && fBC*fCA > 0);
};
/* <<<< Physics.Collision <<<< */