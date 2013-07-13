N3D.Variable.IsInt = function(n) {
  return ((typeof n==='number') && (n%1===0));
};   
N3D.Variable.IsFloat = function(n) {
  return ((typeof n==='number') && (n%1!==0));
};   
N3D.Variable.IsNumber = function(n) {
  return (typeof n==='number');
};
N3D.Variable.IsString = function(n){
  return (typeof n == "string");
};
N3D.Variable.IsArray = function(n){
  return (n.constructor === Array);
};
N3D.Variable.IsObject = function(n){
  return (n.constructor === Object);
};
N3D.Variable.DetectVar = function(o){
  if(typeof o.name !== "undefined"){ return "N3D"; }
  if(this.IsFloat(o)){ return "Float";}
  if(this.IsInt(o)){ return "Int";}
  if(this.IsString(o)){ return "String";}  
  if(this.IsArray(o)){ return "Array";} 
  if(this.IsObject(o)){ return "Object";} 
  return false;
};
N3D.Variable.Traverse = function(v){
  var parent = N3D.Variable;
  var pre = "\t\t\t\t\t\t";
  
  function loop(o,depth){
    var type = parent.DetectVar(o);
    if(o.isN3D == true){ return "[url=http://n3d.cz/wiki/"+o.name+"]N3D."+o.name+"[/url]"; }
    if(type == "Float" || type == "Int"){ return type+"("+o+")"; }
    if(type == "String"){ return type+"("+o.length+")"; }
    var mid_char = pre.substring(0,depth+1);
    var st_char = pre.substring(0,depth);
    var text = "";
    if(type == "Array"){
      var length = o.length;
      
      for(var i=0;i<length;i++){
        text += mid_char+'['+i+'] => '+loop(o[i],depth+1)+"\n";
      }
      return type+"("+length+") => [\n"+text+st_char+"]";  
    }
    if(parent.IsObject(o)){
      var length = 0;
      for(var i in o){
        text += mid_char+'['+i+'] => '+loop(o[i],depth+1)+"\n";
        length++;  
      }
      return type+"("+length+") => {\n"+text+st_char+"}"; 
    }
    return "Undetected";
  };
  
  this.output = loop(v,0);
  
  return this;
};
N3D.Variable.Traverse.prototype = {
  constructor:N3D.Variable.Traverse,
  tree:function(){ 
    return this.output.replace(/\[(url|b|i|u|s)=?(.*?)\](.*?)\[\/\1\]/g,"$3 ($2)"); 
  },
  toHTML:function(){
    function replace(match,type,url,name){
      return "<a href='"+url+"'>"+name+"</a>";
    };
    var output = this.output.replace(/\[(url|b|i|u|s)=?(.*?)\](.*?)\[\/\1\]/g,replace);
    return "<pre>"+output.replace(/\n/g,"<br>").replace(/\t/g,"     ")+"</pre>";
  }
};

$V = N3D.Variable;