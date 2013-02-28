N3D.Game = {
  viewport:{
    width:800,
    height:600,
    aspectRatio:800/600
  },
  update:function(){
    Game.updateStatus = false;
  },
  models:[],
  camera:null,
  renderer:null,
  captureKey:N3D.Utils.CaptureKey,
  updateStatus:false,
  add:function(o){
    if(o instanceof N3D.Scene){
      this.scene = o;
    }else if(o instanceof N3D.FPSCamera){
      this.camera = o;
    }else if(o instanceof N3D.Render){
      this.renderer = o;
    }
  },
  render:function(){
    this.renderer.clear();
    this.camera.update();
    this.scene.update();
  } 
};