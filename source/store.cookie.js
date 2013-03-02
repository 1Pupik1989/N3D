//Store.Cookie
N3D.Cookie = {
  add:function(key, value, settings){
    var settings = settings || N3D.Cookie.settings;
    var setExpires = [], expDate = null;
    var setDate, setTime;
    if(settings.expires !== null){ 
      if(setDate = settings.expires.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/)){
        setExpires.push(setDate[3],setDate[2],setDate[1]);
      }
      if(setTime = settings.expires.match(/(\d{1,2})\:(\d{1,2})/)){
        setExpires.push(parseInt(setTime[1],10)-2,setTime[2]);
        expDate = new Date(Date.UTC.apply(null,setExpires));
      }     
    }

    var value = escape(value) + ((expDate==null) ? "" : "; expires="+expDate.toUTCString());
    document.cookie = escape(key) + "=" + value;
    return true; 
  },
  getAll:function(){
    var cook = document.cookie;
    if(cook.length == 0){ return false; }
    var pairs = cook.split("; ");
    var length = pairs.length;

    var cookies = {};  
    for (var i=0; i<length; i++){
      var pair = pairs[i].split("=");
      cookies[pair[0]] = unescape(pair[1]);
    }
    return cookies;
  },
  clear:function(key){
    document.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
  clearAll:function(){
    var all = this.cookie.match(/\w+(?==)/g);
    if(all === null){ return false; }
    
    var length = all.length;
    for(var i=0;i<length;i++){
      this.clear(all[i]);
    }
  },
  toString:function(){
    var str = "";
    var cook = this.getAll();
    for(var i in cook){
      if(cook.hasOwnProperty(i)){
        str += " "+i+" -> "+cook[i]+",\n";
      }
    }
  
    return "N3D.Cookie(\n"+str+");";
  },
  toConsole:function(){
    return "error";
  }
};
N3D.Cookie.settings = {
  expires:null
};
