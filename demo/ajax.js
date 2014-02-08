var Ajax = (function(){  
  /* >>>> Nastavení XHR objektu >>>> */
  var xhr_constructors = [
    function(){ return new ActiveXObject('Msxml2.XMLHTTP.6.0'); },
    function(){ return new ActiveXObject('Msxml2.XMLHTTP.3.0'); },
    function(){ return new ActiveXObject("Microsoft.XMLHTTP");  },
    function(){ return new XMLHttpRequest();                    }
  ];
  
  var createXHR = null;
  
  for(var i=0,length=xhr_constructors.length;i<length;i++){
    createXHR = xhr_constructors[i];
    try{
      createXHR();
      break;
    }catch(e){}
  }

  if(!createXHR){ throw new Error('Your browser not supported XMLHttpRequest'); }
  /* <<<< Nastavení XHR objektu <<<< */
  
  if(typeof VBArray !== 'undefined'){
    var ie_hack = document.createElement('script');
    ie_hack.type = 'text/vbscript';
  
    var ie_hack_text = 'Function ShowTypes( responseBody )\r\n'+
    //'MsgBox( "Array(CByte()): " & VarType( Array( CByte(1), CByte(2) ) ) )\r\n'+
    'MsgBox( "responseBody: " & VarType( responseBody  ) )\r\n'+
    'End Function\r\n'; 
    
    /*ie_hack_text += 'function ByteArrayToString(theArray)\r\n'+
    'dim i, str\r\n'+

    'if vartype(theArray) < 8192 then\r\n'+
    '       exit function\r\n'+
    'end if\r\n'+
    'for i=lbound(theArray) to ubound(theArray)\r\n'+ 
    '   str = str & asc(theArray(i))\r\n'+
    'next\r\n'+
    'ByteArrayToString = str\r\n'+
    'end function\r\n'; */
    
    
    ie_hack_text += "Function IEBinaryToArray_ByteStr(Binary)\r\n"+
    "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n"+
    //"   IEBinaryToArray_ByteStr = Join(Binary)\r\n"+
    "End Function\r\n"+
    "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n"+
    "   Dim lastIndex\r\n"+
    "   lastIndex = LenB(Binary)\r\n"+
    "   if lastIndex mod 2 Then\r\n"+
    "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n"+
    "   Else\r\n"+
    "       IEBinaryToArray_ByteStr_Last = "+'""'+"\r\n"+
    "   End If\r\n"+
    "End Function\r\n";
    
    ie_hack.text = ie_hack_text;
   
    document.body.appendChild(ie_hack);
  }
  
  
  
  /* >>>> Pomocné funkce >>>> */
  function parseParameters(params){
    if(!params){ return null; }
    
    var out = '';
    for(var i in params){
      out += i+'='+params[i]+'&';
    }

    return out.substr(0,out.length-1);
  };
  /* <<<< Pomocné funkce <<<< */
  
  
  /* >>>> Hlavní metody >>>> */
  function onReadyStateChange(xhr,obj){
    return function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200 && obj.success){
          if(obj.dataType === 'binary-stream'){
            if(ie_hack){

              var rawBytes = IEBinaryToArray_ByteStr(xhr.responseBody);
              var lastChr = IEBinaryToArray_ByteStr_Last(xhr.responseBody);
                
              var bytes = [];
              
              for(var i = 0,n = 0,length = rawBytes.length;i<length;i++,n+=2){
                charCode = rawBytes.charCodeAt(i);
                bytes[n] = charCode & 0xFF;
                bytes[n+1] = (charCode >> 8) & 0xFF;
              }
  
              bytes.push(lastChr.charCodeAt(0) & 0xFF);

              obj.success(BinaryStream.FromByteArray(bytes),xhr);
            }else{
              obj.success(BinaryStream.FromString(xhr.responseText),xhr);   
            }
          }else{
            obj.success(xhr.responseText,xhr);
          }
        }else if(obj.error){
          obj.error(xhr.status,xhr.statusText,xhr);
        }
      }
    };
  };
  /* <<<< Hlavní metody <<<< */
  
  /* >>>> Hlavní konstruktor AJAX >>>> */
  function _Ajax(src,options){
    var prop, xhr;
    
    options = options || {};
    
    if(prop = options.method){ this.method = prop.toUpperCase(); }
    if(prop = options.parameters){ this.parameters = parseParameters(prop); }
    if(prop = options.dataType){ this.dataType = prop; }
    if(prop = options.async){ this.async = prop; }
    
    xhr = this.xhr = createXHR();
    this.src = src;
    
    if(this.async === true){
      xhr.onreadystatechange = onReadyStateChange(xhr,this);
    }   
    
    this.open();    
    this.setOptions();       
    this.send();
    
    return this;
  };
  
  _Ajax.prototype.method = 'GET';
  _Ajax.prototype.async = true;
  _Ajax.prototype.dataType = 'default';
  
  _Ajax.prototype.progress = null;
  _Ajax.prototype.success = null;
  _Ajax.prototype.complete = null;
  _Ajax.prototype.error = null;
  _Ajax.prototype.abort = null;
  

  _Ajax.prototype.setOptions = function(){
    var xhr = this.xhr;
    if(this.dataType === 'binary-stream'){
      if(xhr.overrideMimeType){
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
      }else{
        xhr.setRequestHeader('Access-Control-Allow-origin', 'true');
        xhr.setRequestHeader("Accept","text/plain");
        xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
        xhr.setRequestHeader('Accept-Charset', 'x-user-defined');
      }
    }
  };
  
  
  _Ajax.prototype.open = function(){
    var method = this.method;
    var xhr = this.xhr;
    
    xhr.open(method,this.src+(method === 'GET' && this.parameters ? '?'+this.parameters : ''),this.async);
    
    if(method === 'POST'){
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
  };
  
  _Ajax.prototype.send = function(){
    var method = this.method;
    var xhr = this.xhr;
    
    xhr.send(method === 'POST' && this.parameters ? this.parameters : null);
  };
  /* <<<< Hlavní konstruktor AJAX <<<< */
  
  
  /* >>>> Konstrukční funkce >>>> */
  _Ajax.LoadBinaryFile = function(src,callback){
    var req = new Ajax(src,{
      dataType:'binary-stream'
    });
    
    req.success = callback;
    
    return req;
  };
  
  /* <<<< Konstrukční funkce <<<< */
  
  return _Ajax;
})();
