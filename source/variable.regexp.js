(function(){
  var n = N3D.Variable;
  var posix_reg = /\[\:(.*?)\:\]/g;   
  var group_reg = /\(\?P\<(.*?)\>/g;
  var posix = {
    "<":"\\b",
    ">":"\\b",
    "alnum":"[A-Za-z0-9]",
    "word":"[A-Za-z0-9_]",
    "alpha":"[A-Za-z]",
    "blank":"[ \\t]",
    "cntrl":"[\\x00-\\x1F\\x7F]",
    "digit":"[0-9]",
    "graph":"[\\x21-\\x7E]",
    "lower":"[a-z]",
    "print":"[\x20-\x7E]",
    "punct":"[\-\!\"\#\$%\&'\(\)\* \+,\.\/\:;<=>\?@[\\\]\^_\`{\|}\~]",
    "space":"[ \\t\\r\\n\\v\\f]",
    "upper":"[A-Z]",
    "xdigit":"[A-Fa-f0-9]" 
  };  
  
  N3D.Variable.RegExp = function(re,glob){
    var regex;
    var glob = glob || '';

    var groups = [];

    
    if(posix_reg.test(re)){
      re = re.replace(posix_reg,function(match,name){
        return posix[name] || match;  
      });
    }
    
    if(group_reg.test(re)){
      this.captureGroup = true;
      re = re.replace(group_reg,function(match,name){
        groups.push(name);
        return "(";
      });
      this.groups = groups;
    } 
    
    try{
      regex = new RegExp(re,glob);
    }catch(err){
      console.log("N3D.RegExp: "+err);
      return false;
    }

    this.regex = regex;

    return this; 
    
  };

  N3D.Variable.RegExp.prototype = {
    constructor:N3D.Variable.RegExp,
    isN3D:true,
    name:"Variable.RegExp",
    toString:function(){ return "N3D.Variable.RegExp"; },
    captureGroup:false,
    test:function(str){
      return this.regex.test(str);
    },
    matchAll:function(str,callback){
      var regex = this.regex;
      var result;
      var groups = this.groups;
      var callback = callback || function(){};

      while((result = regex.exec(str)) !== null){
        if(this.captureGroup){
          var name, length = result.length;
          for(var i=1;i<length;i++){
            name = groups[i-1];
            if(typeof name == "string"){
              result[ name  ] = result[i];
            }
          }
          result.splice(0,length);
        }
        callback.call(this,result);
      }
      return this;
    },
    exec:function(str){
      var result = this.regex.exec(str);
      if(!result){ return false; } 
      var groups = this.groups;
      if(groups.length){
        var name, length = result.length;
        for(var i=1;i<length;i++){
          name = groups[i-1];
          if(typeof name == "string"){
            result[ name  ] = result[i];
          }
        }
      }
    
      return result;
    }
};

})();

$RegExp = N3D.Variable.RegExp;