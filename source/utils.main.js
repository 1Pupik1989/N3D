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

N3D.Console = {
  log:"",
  add:function(type){
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    var h = date.getHours();
    var min = date.getMinutes();
    var s = date.getSeconds();
    
    var types = {
      "new": "Created Object instance of function",
      "get": "Access object"
    };
    
    var str = (typeof types[type] !== "undefined" ? types[type] : "");
    
    date = (d<=9?'0'+d:d)+'-'+ (m<=9?'0'+m:m) +'-'+y+" "+
           (h<10?"0"+h:h)+":"+(min<10?"0"+min:min)+":"+(s<10?"0"+s:s);
    
    N3D.Console.log += date+" - "+str+" '"+arguments.callee.caller.name+"'\n";
    console.log(N3D.Console.log);
  }
};