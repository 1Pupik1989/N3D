N3D.Utils.Ajax = function(src,attr,options){
  if(arguments.length == 0){
    return false;
  }
  var options = options || N3D.Utils.Ajax.defaultOptions;
  
  var callback = {
    complete:function(f){ this.complete = f || this.complete; },
    error:function(f){ this.error = f || this.error}
  };
  
  var xmlhttp = new N3D.Utils.Ajax.xmlhttprequest();  
  var attr = (typeof attr !== "undefined") ? (options.method == "get" ? "?" : "")+N3D.Utils.Ajax.parse(attr) : "";

  if(options.method == "post"){
    xmlhttp.open("post",src,true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset="+options.charset);
    xmlhttp.send(attr);
  }else{
    xmlhttp.open("get",src+attr,true);
    xmlhttp.send(null);
  };

  xmlhttp.onreadystatechange = function(){
    if (this.readyState === 4){
      var status = this.status;
      if(status === 200){
        callback.complete((options.dataStructure == "json" ? JSON.parse(this.responseText) : this.responseText));
      }else{
        callback.error(status, this.statusText);
      }
    }
  };

  return callback;
};

N3D.Utils.Ajax.defaultOptions = {
    method:"get",
    charset:"UTF-8"
};
N3D.Utils.Ajax.parse = function(attr){
  var arr = [];
  for(var i in attr){
    arr.push(i+"="+attr[i]);
  }
  return arr.join("&");
};

N3D.Utils.Ajax.get = function(src,parameters){
  return ajax(src,parameters);
};
N3D.Utils.Ajax.post = function(src,parameters){
  return ajax(src,parameters,{method:"post"});
};

N3D.Utils.Ajax.xmlhttprequest = (function(){
  var xml = false, parameter = null;
  if(window.XMLHttpRequest){
    xml = XMLHttpRequest;
  }else if(window.ActiveXObject){
    xml = ActiveXObject;
    if(ActiveXObject("Msxml2.XMLHTTP")){
      parameter = "Msxml2.XMLHTTP";
    }else if(ActiveXObject("Microsoft.XMLHTTP")){
      parameter = "Microsoft.XMLHTTP";
    }
  }
  
  if (!xml) {
    console.log("Ajax not supported");
    return false;
  }
  
  return function(){
    return new xml(parameter);
  };
})();

$ajax = N3D.Utils.Ajax;