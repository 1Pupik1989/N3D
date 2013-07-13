N3D.Graphics.Material = function(opts){
  if(typeof opts !== 'object'){ return this; }
  
  if(opts.specularMap){
    this.specularMap = new N3D.Graphics.Material.Texture(opts.specularMap);
    this.specularMap.parent = this;
    this.textured = true;
  }
  if(opts.specularColor){
    this.specularColor = new N3D.Graphics.Material.Color(opts.specularColor);
    this.specularColor.parent = this;
  }
};
N3D.Graphics.Material.prototype = {
  constructor:N3D.Graphics.Material,
  width:0,
  height:0,
  textured:false,
  ambientColor: null, //Ka
  diffuseColor: null, //Kd
  specularColor: null, //Ks
  ambientMap: null,  //map_Ka
  diffuseMap: null,  //map_Kd
  specularMap: null, //map_Ks
  transparent: 1,
  bind:function(render){
    this.render = render;
    if(this.specularMap !== null){
      this.specularMap.bind(render);
    }
  }
};
N3D.Graphics.Material.id = 0;

N3D.Graphics.Material.Texture = function(src,callback){
  var that = this;
  var img = new Image();
  this.id = 'texture-'+(N3D.Graphics.Material.id++);
  
  img.src = src;
  img.style.display = 'none';

  this.img = img;
  this.src = src;
};
N3D.Graphics.Material.Texture.prototype = {
  width:0,
  height:0,
  texture:null,
  bind:function(render){
    var that = this;
    this.img.onload = function(){
      if(render instanceof N3D.Graphics.Render3D){
        var gl = render.context;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        that.texture = texture; 
      }else if(render instanceof N3D.Graphics.RenderSVG){
        var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        pattern.appendChild(image);
        render.defs.appendChild(pattern);
        pattern.image = image;
        
        pattern.setAttributeNS(null,'id',that.id);
        pattern.setAttributeNS(null,'patternUnits','userSpaceOnUse');
        pattern.setAttributeNS(null,'width',this.width);
        pattern.setAttributeNS(null,'height',this.height);
      
        image.setAttributeNS('http://www.w3.org/1999/xlink','href',that.src);
        image.setAttributeNS(null,'x',0);
        image.setAttributeNS(null,'y',0);
        image.setAttributeNS(null,'width',this.width);
        image.setAttributeNS(null,'height',this.height);
      
        this.pattern = pattern;
      } 

      that.parent.width = that.width = this.width;
      that.parent.height = that.height = this.height;       
    };
    
    if(this.img.complete == true){
      this.img.onload();
    }
  }
};

N3D.Graphics.Material.Color = function(r,g,b,a){
  if(typeof g == 'undefined'){
    this.red = ((r >> 16)&255)/255;
    this.green = ((r >> 8)&255)/255;
    this.blue = (r&255)/255;
    this.alpha = 1;
    
    //console.log(this.red,this.green,this.blue);
    
    return this;
  }
  this.red = r;
  this.green = g;
  this.blue = b;
  this.alpha = a;
  
  return this;
};


N3D.Graphics.Material.Color.prototype = {
  red:0,green:0,blue:0,alpha:1,
  hex:'000000',
  get:function(type){
    if(!type){ return 'rgb('+r+','+g+','+b+')'; }
    var type = type.toLowerCase();
    var r = ~~(this.red*255),
        g = ~~(this.green*255),
        b = ~~(this.blue*255);
    
    if(type == 'hex'){
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1,7);  
    }else if(type == 'rgb'){
      return 'rgb('+r+','+g+','+b+')';  
    }else if(type == 'rgba'){
      return 'rgba('+r+','+g+','+b+','+this.alpha+')';  
    }else if(type == 'rgb-norm'){
      return 'rgb('+this.red+','+this.green+','+this.blue+')';  
    }else if(type == 'rgba-norm'){
      return 'rgba('+this.red+','+this.green+','+this.blue+','+this.alpha+')';  
    }else if(type == 'hsv'){
      var rr, gg, bb,

      r = this.red,
      g = this.green,
      b = this.blue,
      h, s,

      v = Math.max(r, g, b),
      diff = v - Math.min(r, g, b),
      diffc = function (c) {
        return (v - c) / 6 / diff + 1 / 2;
      };

      if (diff === 0) {
        h = s = 0;

      } else {
        s = diff / v;

        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {h = bb - gg}
        else if (g === v) {h = (1 / 3) + rr - bb} 
        else if (b === v) {h = (2 / 3) + gg - rr};
        if (h < 0) {h += 1}
        else if (h > 1) {h -= 1}
      }

      return new N3D.Graphics.Material.Color.HSV(
        (h * 360 + 0.5) |0,
        (s * 100 + 0.5) |0,
        (v * 100 + 0.5) |0
      );
    }
    

    return this;
  },
  toString:function(){
    return 'Color RGB (red='+this.red+', green='+this.green+', blue='+this.blue+', alpha='+this.alpha+')';
  }
};

N3D.Graphics.Material.Color.HSV = function(h,s,v){
  this.hue = h;
  this.saturation = s;
  this.value = v;
  
};
N3D.Graphics.Material.Color.HSV.prototype = {
  toRGB:function(){
    var r,g,b;
    var i;
    var f, p, q, t;
    var h = Math.max(0, Math.min(360, this.hue)),
	      s = Math.max(0, Math.min(100, this.saturation)),
	      v = Math.max(0, Math.min(100, this.value));
        
    s /= 100;
    v /= 100;    
        
    if(s == 0) {
		  // Achromatic (grey)
		  r = g = b = v;
		  return new N3D.Graphics.Material.Color(r, g, b);
	  }    
     
    h /= 60; // sector 0 to 5
	  i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    
    console.log(h);
    
    switch(i) {
		  case 0:r = v; g = t; b = p; break;
      case 1:r = q;	g = v; b = p;	break;
      case 2:r = p; g = v; b = t;	break;
      case 3:r = p; g = q; b = v; break;
      case 4:r = t; g = p; b = v; break;
      default:r = v; g = p; b = q;
    };
    
    return new N3D.Graphics.Material.Color(r, g, b, 1);   
  },
  toString:function(){
    return 'Color HSV (hue='+this.hue+', saturation='+this.saturation+', blue='+this.value+')';
  }
};


N3D.Graphics.Material.Color.Black = new N3D.Graphics.Material.Color(0,0,0,1);
N3D.Graphics.Material.Color.White = new N3D.Graphics.Material.Color(1,1,1,1);

N3D.Graphics.Material.ColorPalette = function(){
  var points = Array.prototype.slice.call(arguments);
  var length = points.length;
  
  var can = document.createElement('canvas');
  can.width = 100;
  can.height = 100;
  
  var ctx = can.getContext('2d');
   
  var gradient = ctx.createLinearGradient(0, 50, 100, 50);
  var ind,color;
  /*for(var i=0;i<length;i++){
    ind = points[i];
    color = new $Graphics_Color(ind[1]).get('hex');
    gradient.addColorStop(ind[0],  color);
  }*/
  
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,100,100);
  
  this.canvas = can;
};

N3D.Graphics.Material.ColorPalette2 = function(){
  var points = Array.prototype.slice.call(arguments);
  var length = points.length;
  
  var can = document.createElement('canvas');
  can.width = 100;
  can.height = 100;
  
  var ctx = can.getContext('2d');
   
  var gradient;
  var ind,color;
  
  for(var i=0;i<length;i++){
    ind = points[i];
    color = new $Graphics_Color(ind[2]);
    console.log(''+color.get('HSV'));
  }
  ctx.fillRect(0,0,100,100);
  //
  
  this.canvas = can;
};

$Graphics_Material = N3D.Graphics.Material;
$Graphics_Texture = N3D.Graphics.Material.Texture;
$Graphics_Color = N3D.Graphics.Material.Color;