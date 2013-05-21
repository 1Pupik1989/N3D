(function(n){
  var alias = {
    "$M4":"Math.Matrix4",
    "$M3":"Math.Matrix3"
  };
  
  var texts = {  
    "Math.Matrix4" : "Math.Matrix4 is constructor for Matrix 4x4",
    "Math.Matrix3" : "Math.Matrix3 is constructor for Matrix 3x3",
  }
  n.Help = function(name){
    var name = alias[name] || name;
    var text = texts[name];
    if(typeof text !== "undefined"){ return text;}
   
    return "Not Found";
  };
})(N3D);
