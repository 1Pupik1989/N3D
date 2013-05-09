N3D.Math.Units = function(input){
  var data = input.match(/(\d+)(\w+)/);
  if(!data){ return false; }
  
  var value = parseFloat(data[1]);
  var units = data[2];
  
  var types = {
    weight: {"kg":1,"g":1000,"lb":2205,"t":0.001,"dkg":100,"mg":1000000,"q":0.01},
    length: {"m":1,"cm":100,"in":39.37,"mm":1000,"ft":3.281,"dm":10,"km":0.001,"yd":1.094,"mi":0.000621371192},
    time:   {"s":1,"min":0.01666666666,"h":0.00027777777,"d":0.00001157407,"ms":1000},
    volume: {"m3":1,"ml":1000000,"l":1000,"hl":10,"dl":10000,"cl":100000,"bl":6.29,"bu":27.496,"ccm":1000000,"km3":0.000000001},
    content:{"m2":1,"ha":0.0001}
  };  
  
  this.units = units;
  this.value = value;
  
  for(var i in types){
    var length = types[i].length;
    for(var j in types[i]){
      if(j == units){
        this.multiplierToDefaultValue = types[i][j];
        this.arrayConvert = types[i];
        break;
      }
    }
  }

};

N3D.Math.Units.prototype = {
  convertTo:function(units){
    var convertValue = this.arrayConvert[units];
    if(typeof convertValue !== "undefined"){
      this.value = this.value/this.multiplierToDefaultValue*convertValue;
      this.units = units;
    }
    
    console.log(this.value);
    
    return this;
  }
};
