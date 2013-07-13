(function(n){
  var alias = {
    "$M4":"Math.Matrix4",
    "$M3":"Math.Matrix3",
    "$RegExp":"Variable.RegExp"
  };
  
  var texts = {  
    "Math.Matrix4" : "N3D.Math.Matrix4 is constructor for create Matrix 4x4.\n\nParameters: N3D.Math.Matrix4(\n\tint n1,\t\tint n2,\t\tint n3,\t\tint n4,\n\tint n5,\t\tint n6,\t\tint n7,\t\tint n8,\n\tint n9,\t\tint n10,\tint n11,\tint n12,\n\tint n13,\tint n14,\tint n15,\tint n16\n);\nExample: N3D.Math.Matrix4(\n\t1,\t2,\t3,\t4,\n\t5,\t6,\t7,\t8,\n\t9,\t10,\t11,\t12,\n\t13,\t14,\t15,\t16\n);",
    "Math.Matrix3" : "N3D.Math.Matrix3 is constructor for create Matrix 3x3.\n\nParameters: N3D.Math.Matrix3(\n\tint n1,\tint n2,\tint n3,\n\tint n4,\tint n5,\tint n6,\n\tint n7,\tint n8,\tint n9\n);\nExample: N3D.Math.Matrix3(\n\t1,\t2,\t3,\n\t4,\t5,\t6,\n\t7,\t8,\t9\n);",
    "Variable.RegExp" : "N3D.Variable.RegExp is an extension of the object RegExp.\n\nParameters: N3D.Variable.RegExp( string );\nExample: var regex = new N3D.Variable.RegExp('~(\w+)~g');"
  }
  n.Help = function(name){
    var name = alias[name] || name.name || name;
    var text = texts[name];
    if(typeof text !== "undefined"){ return text;}
   
    return "Not Found";
  };
})(N3D);

