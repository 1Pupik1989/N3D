N3D.Files.OBJ = function(data,options){
  var line = data.split("\n");
  var length = line.length;
 
  var data = {
    v:[],
    vn:[],
    vt:[],
    f:[]  
  };
  
  var match;
  
  for(var i=0;i<length;i++){
    match = line[i].match(/(v|vt|vn)\s+(\-?\d+\.?\d*)\s+(\-?\d+\.?\d*)\s*(\-?\d+\.?\d*)/);
    if(match !== null){
      data[match[1]].push([parseFloat(match[2]),parseFloat(match[3]),parseFloat(match[4])]);
    }
    
    match = line[i].match(/f\s+([\d+\/]+)\s*([\d+\/]+)?\s*([\d+\/]+)?/);      
    if(match !== null){
      var arr = [match[1],match[2],match[3]];

      data["f"].push(arr);
    }
  } 

  return new N3D.Geometry.Object3D(data,options);  
};
