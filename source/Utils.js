/* >>>> JSON >>>> */
var JSON = JSON || {
  parse:function(text){
    return new Function('return '+text)();
  }
};
/* <<<< JSON <<<< */

N3D.Utils = {};

/* >>>> Utils.Ajax >>>> */
(function(){
  var xml_obj = false, parameter = null;

  if(XMLHttpRequest){
    xml_obj = XMLHttpRequest;
  }else if(ActiveXObject){
    xml_obj = ActiveXObject;
    var values = ["Msxml3.XMLHTTP","Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP"];
    var length = values.length;
    for(var i=0;i<length;i++){
      try{
        new xml_obj(values[i]);
        parameter = values[i];
      }catch(e){
        continue;
      }
    }
  }
  if (!xml_obj) {
    alert("Ajax not supported");
    return false;
  }
  
  function data_to_parameters(data){
    if(typeof data == 'undefined'){ return ''; }
    if(typeof data == 'string'){ return data; }
    
    var a = [];
    for(var i in data){
      a.push(i+"="+data[i]);
      
    }
    return a.join('&');  
  }
  
  function outputData(data,type){
    var act = false;
    switch(type){
      case 'json':
      case 'jsonp': act = JSON.parse;
    }
    
    if(act !== false){
      try{
        return act(data);
      }catch(e){}
    }

    return data;
  }
  
  function request(a,b,c){
    var o = {
      data: {},
      callback: function(){},
      dataType: null
    };
    
    var args = Array.prototype.slice.call(arguments);
    var length = args.length;
    
    for(var i=0;i<length;i++){
      var arg = args[i];
      var type = typeof arg;
      if(type == "object"){
        o.data = arg;
      }else if(type == "function"){
        o.callback = arg;
      }else if(type == "string"){
        o.dataType = arg;
      }
    }

    return o;
  }
  
  N3D.Utils.GET = function(url,a,b,c){
    var o = request(a,b,c); 

    var a = new N3D.Utils.Ajax({
      url:url,
      data:o.data,
      method:"GET",
      dataType:o.dataType
    });
    a.success(o.callback);
    return a; 
  };
  
  N3D.Utils.POST = function(url,a,b,c){
    var o = request(a,b,c); 

    var a = new N3D.Utils.Ajax({
      url:url,
      data:o.data,
      method:"POST",
      dataType:o.dataType
    });
    a.success(o.callback);
    return a;    
  };
  
  function async_handler(){
    var that = this;
    return function(){
      if(this.readyState === 4){
        if(this.status == 200){
          that.success(outputData(this["response"+that.responseType],that.dataType)); 
        }else{
          var handler_error = that.statusCode[this.status];
          if(typeof handler_error == "function"){
            handler_error();
          }
          that.error(that.xhr,this.status,this.statusCode);
        }
        that.complete();
      }
    }
  };
  
  function nonsync_handler(o){
    o.text = outputData(this["response"+o.responseType],o.dataType);
  };
  
  function setHeaders(xhr,o){
    if(typeof o == "object"){
      for(var i in o){
        xhr.setRequestHeader(i,o[i]);
      }
    }
  }
  
  
  N3D.Utils.Ajax = function(options){
    if(typeof options.url !== 'string'){ return false; }
    
    var that = this;
    var data = this.data = data_to_parameters(options.data);
    var xhr = this.xhr = new xml_obj(parameter);
        
    this.url = options.url;
    this.statusCode = {};
    this.method = (options.method || this.method).toLowerCase();
    this.dataType = (options.dataType || this.dataType).toLowerCase();
    this.async = (typeof options.async !== 'undefined' ? options.async : this.async);
    this.charset = (options.charset || this.charset);
    this.mimeType = options.mimeType || this.mimeType;
    this.responseType = (typeof options.responseType !== 'undefined' ? options.responseType : this.responseType);

    if(typeof options.beforeSend == 'function'){
      options.beforeSend(xhr);
    }
    
    if(this.method == 'post'){
      xhr.open(this.method,options.url,this.async);
      
      xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded;charset='+this.charset);
      xhr.overrideMimeType(this.mimeType);
      setHeaders(xhr,options.headers);
      xhr.send(data);
    }else{
      if(data.length !==0){
        data = '?'+data;
      }
      xhr.open(this.method,options.url+data,this.async);
      if(xhr.overrideMimeType){
        xhr.overrideMimeType(this.mimeType);
      }
      setHeaders(xhr,options.headers);
      xhr.send(null);
    }
    
    
    if(this.async == true){
      xhr.onreadystatechange = async_handler.call(this);
    }else{
      nonsync_handler.call(xhr,this);
    } 

  };
  N3D.Utils.Ajax.prototype = {
    async:true,
    dataType:'text',
    method:'get',
    charset:'utf8',
    mimeType:'text/plain',
    responseType:"Text",
    complete: function(f){ this.complete = f || this.complete; },
    error: function(f){ this.error = f || this.error },
    success: function(f){ this.success = f || this.success },
    getAllHeaders:function(){
      var headers = this.xhr.getAllResponseHeaders();
      if(headers){
        var regex = /^(.*?)\s*\:\s*(.*?)$/gm;
        var result;
        var o = {};
        while((result = regex.exec(headers)) !== null){
          o[result[1]] = result[2];  
        }
        return o;
      }
      return null;
    }
  }
  
})(); 

/* <<<< Utils.Ajax <<<<*/

/* >>>> Utils.Eventes >>>> */
N3D.Utils.Events = function(){
  this.keylist = {};   
};
N3D.Utils.Events.LeftArrow = 37;
N3D.Utils.Events.UpArrow = 38;
N3D.Utils.Events.RightArrow = 39;
N3D.Utils.Events.DownArrow = 40;


N3D.Utils.Events.prototype.addKey = function(type,action){
  var that = this;
  
  var list = this.keylist;
  list[type] = action;  
  
  document.body.onkeydown = function(e){
    e = e || window.event;
    var key = list[e.keycode || e.which];

    if(typeof key !== 'undefined'){
      key.call(that.parent);
      return false;
    }
    return true; 
  };
};                           
/* <<<< Utils.Evenets <<<< */


N3D_U_Ajax = N3D.Utils.Ajax;
N3D_U_GET = N3D.Utils.GET;
N3D_U_POST = N3D.Utils.POST;
N3D_U_Events = N3D.Utils.Events;