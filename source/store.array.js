//Store.Array
N3D.Array = function(){
  this.values = Array.apply(null,arguments);
  return this;
};
N3D.Array.prototype = {
  constructor:Array,
  each: function(callback){
    var el = this.values;
    var length = el.length;
    for(var i=0;i<length;i++) callback(el[i]);
  }  
};
/*N3D.Array.prototype.insertionSort = function(callback){
  var callback = (typeof callback === "function" ? callback : function(a,b){ return b>a; });
  
  function getter(a,b){
    var c = callback(a,b);
    
    return ((typeof c === "boolean") ? c : Boolean(c>0));
  }
    
  for (var j = 1; j < this.length; j++) {
    var key = this[j], i = j - 1;
    while (i >= 0 && getter(key,this[i])){
      this[i+1] = this[i];
      i--;
    }
    this[i+1] = key;
  }  
};
N3D.Array.prototype.bubbleSort = function() {
  var arr = this;
  if (arr.length <= 1) {
    return arr;
  }
  for (var i = arr.length - 1; i > 0; i--) {
    for (var j = i - 1; j >= 0; j--) {
      if (arr[j] < arr[j - 1]) {
        var tmp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = tmp;
      }
    }
  }
  
  return arr;

};

N3D.Array.prototype.quickSort = function(arr) {
  if (this.length <= 1) {
    return this;
  }
  var pivot = this.splice(Math.floor(this.length / 2), 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < this.length; i++) {
    if (this[i] < pivot) {
      left.push(this[i]);
    } else {
      right.push(this[i]);
    }
  }

  return left.quickSort().concat([pivot], right.quickSort());
};    */

$array = N3D.Array;
