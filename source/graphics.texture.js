N3D.Texture = function(src){
  this.img = new Image();
  this.img.src = src;
  this.img.onload = function(){};
  
  return this;
};
N3D.Texture.prototype = {
  getUV:function(x,y){
    return new Vector2(x*this.img.width,(1-y)*this.img.height);
  },
  get:function(){
    return this.img;
  }
};
