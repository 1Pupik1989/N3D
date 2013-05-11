N3D.Graphics.Color = function(type,a,b,c,d){
  var s = new type(a,b,c,d);
  this.convertFrom(s);
  this.alpha = (typeof d !== "undefined") ? d : 1;
  this.storeColor = [this.red,this.green,this.blue,this.alpha];
  
  return this;
};

N3D.Graphics.Color.prototype = {
  set:function(r,g,b){
    this.red = r;
    this.green = g;
    this.blue = b;  
  },
  setBrightness:function(l){
    var colors = this.storeColor;
    
    var l = Math.max(0,Math.min(l,100));
    
    this.red = colors[0];
    this.green = colors[1];
    this.blue = colors[2];
    
    var c = this.convertTo(N3D.Graphics.Color.HSL);
    c.l = l;
    var c = new N3D.Graphics.Color(N3D.Graphics.Color.HSL,c.h,c.s,c.l);
    c = c.convertTo(N3D.Graphics.Color.RGB);
    
    this.red = c.r;
    this.green = c.g;
    this.blue = c.b;   
    
    
    console.log(this);
    /*var l = l/100;
    
    this.red = Math.max(0,Math.min(1,colors[0]+l));
    this.green = Math.max(0,Math.min(1,colors[1]+l));
    this.blue = Math.max(0,Math.min(1,colors[2]+l));   */
    
    return this;  
  },
  setSaturation:function(l){
    var colors = this.storeColor;
    
    var l = Math.max(0,Math.min(l,100));
    
    /*var c = this.convertTo(N3D.Graphics.Color.HSL);
    c.l = l;
    var c = new N3D.Graphics.Color(N3D.Graphics.Color.HSL,c.h,c.s,c.l);
    
    this.red = c.r;
    this.green = c.g;
    this.blue = c.b; */    
    
    var l = l/100;
    
    this.red = Math.max(0,Math.min(1,colors[0]+l));
    this.green = Math.max(0,Math.min(1,colors[1]+l));
    this.blue = Math.max(0,Math.min(1,colors[2]+l));
    
    return this;  
  },
  convertFrom:function(obj){
    var cons = obj.constructor;
    var that = this;
    var inv255 = 1/255;

    function setRGB(){
      that.red = obj.r/255;
      that.green = obj.g/255;
      that.blue = obj.b/255;
    };

    function setHEX(){
      var hex = parseInt("0x"+obj.hex.replace(/#/,""));

      that.red = ( hex >> 16 & 255 ) * inv255;
      that.green = ( hex >> 8 & 255 ) * inv255;
      that.blue = ( hex & 255 ) * inv255;
    };
    
    function setCMYK(){
      var k = obj.k;
      var n = 1 - k;
 
		  that.red = 1 - Math.min( 1, obj.c * n + k );
		  that.green = 1 - Math.min( 1, obj.m * n + k );
		  that.blue = 1 - Math.min( 1, obj.y * n + k );
    };
    
    function setHSV(){
      var h = obj.h / 360,
          s = obj.s / 100,
          v = obj.v / 100;
      var r,g,b;
      
		  if (s == 0) {
        that.red = v * 255;
			  that.green = v * 255;
			  that.blue = v * 255;
       
        return;
		  }else{
        var h = h * 6,
			      i = Math.floor(h),
			      n1 = v * (1 - s),
			      n2 = v * (1 - s * (h - i)),
			      n3 = v * (1 - s * (1 - (h - i)));

        switch(i){
          case 0:   that.red = v;   that.green = n3;  that.blue = n1; break;
          case 1:   that.red = n2;  that.green = v;   that.blue = n1; break;
          case 2:   that.red = n1;  that.green = v;   that.blue = n3; break;
          case 3:   that.red = n1;  that.green = n2;  that.blue = v; break;
          case 4:   that.red = n3;  that.green = n1;  that.blue = v; break;
          default:  that.red = v;   that.green = n1;  that.blue = n2; 
        };
		  }
    };
    
    function setHSL(){
      var h = obj.h / 360,
          s = obj.s / 100,
          l = obj.l / 100;
      var r, g, b;

      if(s == 0){
        that.r = that.g = that.b = l; // achromatic
      }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        that.red = hue2rgb(p, q, h + 1/3);
        that.green = hue2rgb(p, q, h);
        that.blue = hue2rgb(p, q, h - 1/3);
      }
    };

    switch(cons){
      case N3D.Graphics.Color.HEX:  setHEX(); break;
      case N3D.Graphics.Color.CMYK: setCMYK(); break;
      case N3D.Graphics.Color.RGB:  setRGB(); break;
      case N3D.Graphics.Color.HSV:  setHSV(); break;
      case N3D.Graphics.Color.HSL:  setHSL(); break;
      default: this.setRGB(1,1,1);
    };
    
    //this.brightness = this.red*0.3 + this.green*0.59 + this.blue*0.11;
    //this.brightness = (this.red + this.green + this.blue)/3;
    this.brightness = Math.sqrt(this.red*this.red*0.241 + this.green*this.green*0.691 + this.blue*this.blue*0.068);

    return this;
  },
  convertTo:function(type){
    var red = this.red,
        green = this.green,
        blue = this.blue;
    var r = Math.round(red * 255),
        g = Math.round(green * 255),
        b = Math.round(blue * 255);
          
    function getHEX(){
      if(r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255){ return false; }
      return new N3D.Graphics.Color.HEX("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1,7));
    };
    
    function getRGB(){
      return new N3D.Graphics.Color.RGB(r,g,b);
    }
    
    function getHSV(){
      var minVal = Math.min(red, green, blue);
		  var maxVal = Math.max(red, green, blue);
		  var delta = maxVal - minVal;
 
      var h = 0, s = 0, v = maxVal;

 
		  if (delta == 0) {
        return [h,s,v];
		  } else {
			  s = delta / maxVal;
			  var del_R = (((maxVal - red) / 6) + (delta / 2)) / delta;
			  var del_G = (((maxVal - green) / 6) + (delta / 2)) / delta;
			  var del_B = (((maxVal - blue) / 6) + (delta / 2)) / delta;
 
			  if (red == maxVal) { h = del_B - del_G; }
			  else if (green == maxVal) { h = (1 / 3) + del_R - del_B; }
			  else if (blue == maxVal) { h = (2 / 3) + del_G - del_R; }
 
			  if (h < 0) { h += 1; }
			  if (h > 1) { h -= 1; }
      }

		  return new N3D.Graphics.Color.HSV(
        Math.round(h * 360),
        Math.round(s * 100),
        Math.round(v * 100)
      );
    };
    
    function getHSL(){
      var min = Math.min(red, green, blue),
          max = Math.max(red, green, blue),
          h, s, l = (max + min) / 2;

      if(max == min){
          h = s = 0; // achromatic
      }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        if(max == red){
          h = (green - blue) / d + (green < blue ? 6 : 0);
        }else if(max == green){
          h = (blue - red) / d + 2;
        }else if(max == blue){
          h = (red - green) / d + 4;
        }

        h /= 6;
      }

      return new N3D.Graphics.Color.HSL(
        Math.round(h * 360),
        Math.round(s * 100),
        Math.round(l * 100)
      );
    };
    
    
    function getCMYK(){
		  var k = Math.min( 1 - red, 1 - green, 1 - blue );
		  var c = ( 1 - red - k ) / ( 1 - k ) * 100;
		  var m = ( 1 - green - k ) / ( 1 - k ) * 100;
		  var y = ( 1 - blue - k ) / ( 1 - k ) * 100;
      k *= 100;
 
		  return new N3D.Graphics.Color.CMYK(
        Math.round(c),
        Math.round(m),
        Math.round(y),
        Math.round(k)
      );
  }
    
    switch(type){
      case N3D.Graphics.Color.HEX: return getHEX();break;
      case N3D.Graphics.Color.RGB: return getRGB();break;
      case N3D.Graphics.Color.HSV: return getHSV();break;
      case N3D.Graphics.Color.HSL: return getHSL();break;
      case N3D.Graphics.Color.CMYK: return getCMYK();break;
      default:console.log("none");
    };

  },
  toString:function(){
    return "N3D.Graphics.Color(\n"+
    "\tRed:"+this.red+"\n" +
    "\tGreen:"+this.green+"\n" + 
    "\tBlue:"+this.blue+"\n" +
    "\tAlpha:"+this.alpha+"\n" +
    "\tBrightness:"+this.brightness+"\n" + 
    ")";  
  }
};

N3D.Graphics.Color.CMYK = function(c,m,y,k){
  this.c = c;
  this.m = m;
  this.y = y;
  this.k = k; 
};

N3D.Graphics.Color.RGB = function(r,g,b){
  this.r = r;
  this.g = g;
  this.b = b;
};

N3D.Graphics.Color.HSV = function(h,s,v){
  this.h = h;
  this.s = s;
  this.v = v;
};

N3D.Graphics.Color.HSL = function(h,s,l){
  this.h = h;
  this.s = s;
  this.l = l;
};
N3D.Graphics.Color.HEX = function(hex){
  this.hex = hex;  
};


N3D.Graphics.Texture = function(src,render){
  this.image = new Image();
  this.image.onload = function(){

  }
  this.image.src = src;
  
  return this;
};
N3D.Graphics.Texture.prototype = {
  getUV:function(v){
    var x = v.original.x;
    var y = v.original.y;

    if(y<0){
      y+=2;
    }
    
    v.x = ~~(x*this.image.width);
    v.y = ~~((1-y)*this.image.height);
    
    return v;
  },
  bind:function(render){
    var ctx = render.context;
    this.texture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, this.texture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, this.image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_NEAREST);
    ctx.generateMipmap(ctx.TEXTURE_2D);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
  }
};


N3D.Graphics.Material = {};
N3D.Graphics.Material.Blank = function(){
};
N3D.Graphics.Material.Blank.prototype = {
  getUV:function(v){
    return v;
  }
};

$Texture = N3D.Graphics.Texture;
$Color = N3D.Graphics.Color;
