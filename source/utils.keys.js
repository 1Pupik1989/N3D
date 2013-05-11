N3D.Utils.Keys = {
  Up:38,
  Down:40,
  Left:37,
  Right:39,
  W:87,
  A:65,
  S:83,
  D:68
};

N3D.Utils.CaptureKey = function(){     //zachytávání kláves
  var keypressed = {};
  var key;
  var status = 0;
  document.body.onkeydown = function(e){
    keypressed[e.which] = true;
    for(var i=0;i<keyEvent.store.length;i++){
      key = keyEvent.store[i];
      status = 0; 
      for(var j=0;j<key.k.length;j++){
        if(keypressed[key.k[j]] === true){
          status++;
        }
      }
      if(status == key.k.length){
        key.c();
      }
    }
  }
  document.body.onkeyup = function(){
    keypressed = {};
    document.getElementById("test").innerHTML = "";
  }
};
N3D.Utils.CaptureKey.status = false;
N3D.Utils.CaptureKey.store = [];
N3D.Utils.CaptureKey.add = function(keys,callback){ // funtion (Array,callback) or function (Interger,callback)
  var keys = (keys instanceof Array) ? keys : [keys];
  keyEvent.store.push({k:keys,c:callback});
  if(keyEvent.status == false){
    keyEvent.status = true;
    keyEvent();
  }
};
/*Konec klávesových funkcí*/