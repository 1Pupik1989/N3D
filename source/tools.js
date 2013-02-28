/*
Knihovna událostí
*/
N3D.Utils = {};

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


/*Pole*/
N3D.Utils.Array = function(){};

N3D.Utils.Array.prototype.bubbleSort = function(){
  var swapped;
  do {
      swapped = false;
      for (var i=0; i < this.length-1; i++) {
          if (this[i] > this[i+1]) {
              var temp = this[i];
              this[i] = this[i+1];
              this[i+1] = temp;
              swapped = true;
          }
      }
  } while (swapped);
};

N3D.Utils.Array.prototype.insertSort = function(){
  var callback = (typeof callback === "function" ? callback : function(a,b){ return b-a; });
    
  for (var j = 1; j < this.length; j++) {
    var key = this[j], i = j - 1;
    while (i >= 0 && callback(key,this[i])){
      this[i+1] = this[i];
      i--;
    }
    this[i+1] = key;
  }  
};

N3D.Utils.Array.prototype.copy = function(){
  return this.slice();
};