N3D.Scene = function(){};
N3D.Scene.prototype = {
  add:function(o){
    if(o instanceof N3D.Object3D){
      this.models.push(o);
      this.triangles = this.triangles.concat(o.triangles);
    }
  },
  render:function(){ //vykreslování
    
  },
  update:function(cam){
    for(var i=0;i<this.models.length;i++){
      this.models[i].applyMVP(N3D.Game.camera);
    }
    
    this.triangles.sort(function(a,b){
      return (b.zDepth()>a.zDepth() ? 1 : -1);
    });

    
    
    var length = this.triangles.length;
    
    for(var i=0;i<length;i++){
      this.triangles[i].draw(N3D.Game.renderer.context);
    }
    
  }
};



N3D.Scene3D = function(){
  this.models = [];
  this.triangles = [];
  this.lights = [];
  this.camera = null;
  this.renderer = null;
};
N3D.Scene3D.prototype = N3D.Scene.prototype;
N3D.Scene3D.prototype.toString = function(){
  return "N3D.Scene3D";
};