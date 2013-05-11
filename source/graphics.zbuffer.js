N3D.Graphics.ZBuffer = function(polygons){
  var can = document.createElement("canvas");
  var ctx = can.getContext("2d");
  
  this.canvas = can;
  this.context = ctx;
};

N3D.Graphics.ZBuffer.prototype = {
  add:function(polygons){
    var width = this.canvas.width = $Game.viewport.width;
    var height = this.canvas.height = $Game.viewport.height;

    var length = polygons.length;
    var ctx = this.context;

    var N = (1<<16);
    var zNear = 1;
    var zFar = 100;
    var a = zFar / ( zFar - zNear );
    var b = zFar * zNear / ( zNear - zFar );
    var z = 50;
    var invC = -1/256;
    
    
    var lightPosition = new $V3(0,0,10);
    var lightIntensity = 255;
    var pointIntensity;
    var normal = new $V3(0,0,5);

    var colorFromA = ctx.getImageData(0,0,500,500);
    for(var i=0;i<length;i++){
      var poly = polygons[i];

      var u = $V3.Sub(poly.vp0,lightPosition).normalize();
      pointIntensity = lightIntensity * (u.x * normal.x + u.y * normal.y + u.z * normal.z);
      //console.log(pointIntensity);

      var depth = ~~((N * ( a + b / Math.max(poly.vp0.z,poly.vp1.z,poly.vp2.z) ))*invC);

      var x0 = poly.vp0.x, x1 = poly.vp1.x, x2 = poly.vp2.x;
      var y0 = poly.vp0.y, y1 = poly.vp1.y, y2 = poly.vp2.y;
        
      ctx.fillStyle = ctx.strokeStyle = "rgb("+depth+","+depth+","+depth+")";
      
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    
  }
};