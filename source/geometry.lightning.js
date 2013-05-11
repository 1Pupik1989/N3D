var Ray = function(attr,container){
  if(attr.nesting <=0){  return false; }

  this.container = container;
  this.offset = attr.offset;
  this.minOffset = attr.minOffset;
  this.nesting = attr.nesting;
  
  this.points = [];
  
  var startPoint = attr.startPoint.clone();
  var endPoint = attr.endPoint.clone();
  
  startPoint.id = 0;
  endPoint.id = 1;
  
  this.limitAngle = $Math.PiOver180*70;
  
  this.create(startPoint,endPoint,attr.offset);
  
  this.points.sort(function(a,b){
    return a.id - b.id;
  }); 
  
  this.points.lineWidth = this.nesting;
  container.push(this.points);
};
Ray.prototype = {
  create:function(startPoint,endPoint,offset){
    var parent = this.parent;
    
    if(offset<this.minOffset){ return false; }
    if(this.points.length == 0){
      this.points.push(startPoint,endPoint);
    }

    
    var midPoint = $V2.Average(startPoint, endPoint);
    midPoint.id = startPoint.id + (endPoint.id-startPoint.id)*0.5;
    
    var perp = $V2.Sub(endPoint,startPoint).normalize().perpendicular().multiplyScalar($Math.randomFloat(-offset,offset));
    midPoint.add(perp);
    
    var randomAngle = $Math.randomFloat(-this.limitAngle,this.limitAngle)+$Math.PiOver180*180;

    var splitEnd = $V2.Sub(midPoint,startPoint).rotate(randomAngle).multiplyScalar(0.7).add(midPoint);

    this.points.push(midPoint);
    var nextOffset = offset * 0.5; 
    
    if(Math.random()>0.4){
      var secRay = new Ray({
        startPoint:midPoint,
        endPoint:splitEnd,
        offset:nextOffset,
        minOffset:this.minOffset,
        nesting:this.nesting-1
      },this.container);
    }   
    
    this.create(startPoint,midPoint,nextOffset);
    this.create(midPoint,endPoint,nextOffset);
  }
};

N3D.Geometry.Lightning = function(attr){
  /*if(typeof attr.sound !== "undefined"){
    var sound = new N3D.Audio(attr.sound);  
  } */
};
N3D.Geometry.Lightning.prototype = {
  generate:function(x1,y1,x2,y2){
    this.node = [];
    new Ray({
      startPoint:new $V2(x1,y1),
      endPoint:new $V2(x2,y2),
      offset:100,
      minOffset:6.25,
      nesting:5
    },this.node);
  },
  draw:function(){
    var ctx = this.render;
    var points = this.node;
    var length = points.length;
    
    var colors = [
      "rgba(164,125,243,0.05)",
      "rgba(164,125,243,0.05)",
      "rgba(164,125,243,0.05)",
      "rgba(164,125,243,0.05)",
      "rgba(164,125,243,0.1)",
      "rgba(164,125,243,0.1)",
      "rgba(164,125,243,0.1)",      
      "rgba(164,125,243,0.4)",
      "rgba(216,203,241,0.4)",
      "rgba(216,203,241,0.5)"
    ]
    
    
    
    ctx.lineJoin="round";
    ctx.lineCap = 'round';
    
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    for(var i=0;i<length;i++){
      var ray_length = points[i].length;
     // ctx.lineWidth = points[i].lineWidth;
      
      var lineOpacity = 0;
      for(var n=0;n<10;n++){
        ctx.beginPath();
        ctx.strokeStyle = colors[n];
        ctx.lineWidth = (10-n)*2;
        for(var j=0;j<ray_length-1;j++){
          var pointA = points[i][j];
          var pointB = points[i][j+1];
        
          if(j==0){
            ctx.moveTo(pointA.x,pointA.y);
          }/*else{
            ctx.lineTo(pointA.x,pointA.y);          
          }*/
        
          var xc = (pointA.x + pointB.x) / 2;
          var yc = (pointA.y + pointB.y) / 2;
          ctx.quadraticCurveTo(pointA.x, pointA.y, xc, yc);
        
       
        
        }
        lineOpacity += 0.05; 
        ctx.stroke();
      }
      
    }

  }
};
