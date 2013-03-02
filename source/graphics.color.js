// Graphics.Color
N3D.Color = function(r,g,b){
  if(typeof r == "string"){
    if(typeof N3D.Color.standart16[r] !== "undefined"){
      var c = N3D.Color.standart16[r];
      this.set.apply(this,c);
      return this;
    }
    var c = this.set.apply(this,N3D.Color.HEXtoRGB(r,g,b));

    return this;
  }
  
  this.set(r,g,b);
  
  return this;
};
N3D.Color.prototype = {
  set:function(r,g,b,a){
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a || 1;
  },
  toString:function(){
    return "N3D.Color(\n"+
           "\tred:"+this.red+",\n"+
           "\tgreen:"+this.green+",\n"+
           "\tblue:"+this.blue+",\n"+
           "\talpha:"+this.alpha+"\n)";
  },
  getRGBa:function(){
    return "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";  
  }
};
N3D.Color.HEXtoRGB = function(hex){
  var hex = (hex).substring(1);
  
  if(hex.length == 3){
    var h = hex;
    var r = h.charAt(0);
    var g = h.charAt(1);
    var b = h.charAt(2); 
    hex = r+r+g+g+b+b; 
  }
  hex = '0x'+hex;

  return [(hex>>16)&255,(hex>>8)&255,hex&255];     
};
N3D.Color.standart16 = {
  "white":[255,255,255],
  "yellow":[255,255,0],
  "fuhcsia":[255,0,255],
  "red":[255,0,0],
  "silver":[192,192,192],
  "gray":[128,128,128],
  "olive":[128,128,0],
  "purple":[128,0,128],
  "maroon":[128,0,0],
  "aqua":[0,255,255],
  "lime":[0,255,0],
  "teal":[0,128,128],
  "green":[0,128,0],
  "blue":[0,0,255],
  "navy":[0,0,128],
  "black":[0,0,0],
};

$color = N3D.Color;