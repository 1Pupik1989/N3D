function BinaryParser(){
  this.map = [];
};

/* >>>> Bytes >>>> */
BinaryParser.prototype.readBytes = function(offset,length,is_little){
  for(var data = new Array(length), map = this.map, i=offset,f = 0, length = offset+length;i<length;i++,f++){
    data[f] = map[i];
  }
  
  return is_little === true ? data.reverse() : data;
};

BinaryParser.prototype.writeBytes = function(offset,values){
  for(var map = this.map, i=offset,f = 0,length = offset+values.length;i<length;i++,f++){
    map[i] = values[f];  
  } 
  return this;  
};
/* <<<< Bytes <<<< */

/* >>>> Int8 & UInt 8 >>>> */
BinaryParser.prototype.readInt8 = function(offset,is_little){
  return (this.map[offset] << 24) >> 24; 
};  

BinaryParser.prototype.readUInt8 = function(offset,is_little){
  return this.map[offset] >>> 0;
};
BinaryParser.prototype.writeInt8 = function(offset,value, is_little){
  this.map[offset] = value & 0xFF;  
  return this;    
};
/* <<<< Int8 & UInt 8 <<<< */

/* >>>> Int16 & UInt 16 >>>> */ 
BinaryParser.prototype.readInt16 = function(offset,is_little){
  var data = this.map;
  
  return is_little === true ? 
         (data[offset+1] << 8) + data[offset] : 
         (data[offset] << 8) + data[offset+1];
};  

BinaryParser.prototype.readUInt16 = function(offset,is_little){
  var data = this.map;
  
  return is_little === true ? 
         ((data[offset+1] << 8) + data[offset]) >>> 0 : 
         ((data[offset] << 8) + data[offset+1]) >>> 0;
};
BinaryParser.prototype.writeInt16 = function(offset,value, is_little){
  var map = this.map;
  
  if(is_little === true){
    map[offset+1] = (value >> 8) & 0xFF;
    map[offset] = value & 0xFF;  

    return this;
  }

  map[offset] = (value >> 8) & 0xFF;
  map[offset+1] = value & 0xFF;  

  return this;    
};
/* <<<< Int16 & UInt 16 <<<< */

/* >>>> Int32 & UInt 32 >>>> */
BinaryParser.prototype.readInt32 = function(offset,is_little){
  var data = this.map;
  
  return is_little === true ? 
         (data[offset+3] << 24) + (data[offset+2] << 16) + (data[offset+1] << 8) + data[offset] : 
         (data[offset] << 24) + (data[offset+1] << 16) + (data[offset+2] << 8) + data[offset+3];
};

BinaryParser.prototype.readInt322 = function(offset,is_little){
  var data = this.map;
  
  return is_little === true ? 
         (data[offset+3] << 24) + (data[offset+2] << 16) + (data[offset+1] << 8) + data[offset] : 
         (data[offset] << 24) + (data[offset+1] << 16) + (data[offset+2] << 8) + data[offset+3];
};

BinaryParser.prototype.readUInt32 = function(offset,is_little){
  var data = this.map;
  
  return is_little === true ? 
         ((data[offset+3] << 24) + (data[offset+2] << 16) + (data[offset+1] << 8) + data[offset]) >>> 0 : 
         ((data[offset] << 24) + (data[offset+1] << 16) + (data[offset+2] << 8) + data[offset+3]) >>> 0;
};

BinaryParser.prototype.writeInt32 = function(offset,value, is_little){
  var map = this.map;
  
  if(is_little === true){
    map[offset+3] = (value >> 24) & 0xFF;
    map[offset+2] = (value >> 16) & 0xFF;
    map[offset+1] = (value >> 8) & 0xFF;
    map[offset] = value & 0xFF;  
    
    return this;
  }
  
  map[offset] = (value >> 24) & 0xFF;
  map[offset+1] = (value >> 16) & 0xFF;
  map[offset+2] = (value >> 8) & 0xFF;
  map[offset+3] = value & 0xFF;  

  return this;    
};
/* <<<< Int32 & UInt 32 <<<< */

/* >>>> Float32 >>>> */
BinaryParser.prototype.readFloat32 = function(offset,is_little){
  var data = this.readInt32(offset,is_little),
      sign = (data & 0x80000000) ? -1 : 1,
      exponent = ((data >> 23) & 0xFF) - 127,
      significand = (data & ~-0x800000);

  if(exponent == 128){ 
    return significand ? Number.NaN : Number.POSITIVE_INFINITY;
  }
  if(exponent == -127){
    if (significand == 0) return 0;
    exponent = -126;
    significand /= 0x400000;
  }else{
    significand = (significand | 0x800000) / 0x800000;
  }

  return sign * significand * Math.pow(2, exponent);
};

BinaryParser.prototype.writeFloat32 = function(offset,value,is_little){
  var bytes = 0;
  
  if(value == Infinity){ this.writeBytes(offset,[0x7F,0x80,0,0],is_little); return; }
  else if(value == -Infinity){ this.writeBytes(offset,[0xFF,0x80,0,0],is_little); }
  else if(value == 0){ this.writeBytes(offset,[0,0,0,0],is_little); }
  else if(value == NaN){ this.writeBytes(offset,[0x7F,0xC0,0,0],is_little); }
  if (value <= 0) {
    bytes = 0x80000000;
    value = -value;
  }

  var exponent = ~~(Math.log(value) / Math.log(2));
  var significand = ((value / Math.pow(2, exponent)) * 0x00800000) | 0;

  exponent += 127;
  if(exponent >= 0xFF){
  exponent = 0xFF;
    significand = 0;
  }else if(exponent < 0){ 
    exponent = 0;
  }

  bytes = bytes | (exponent << 23);
  bytes = bytes | (significand & ~(-1 << 23));
  
  this.writeBytes(offset,[
    (bytes >> 24) & 0xFF,
    (bytes >> 16) & 0xFF,
    (bytes >> 8) & 0xFF,
    bytes & 0xFF
  ],is_little);
};
/* <<<< Float32 <<<< */

/* >>>> Float64 >>>> */
BinaryParser.prototype.readFloat64 = function(offset,is_little){
  //var data = this.readBytes(offset,8,is_little);
  var data = this.map;
  
  var e = is_little ? 7 : 0;
   
  var v0 = data[offset+e], v1 = data[offset+(e-1)];
  var exp = (( v0 & 0x7F ) * 16 + ( ( v1 & 0xF0 ) * 0.0625 ))-1023;
  var mantissa = 0x10 + ( v1 & 0x0F );
  
  mantissa = ( mantissa * 0x100 ) + data[offset+(e-2)];
  mantissa = ( mantissa * 0x100 ) + data[offset+(e-3)];
  mantissa = ( mantissa * 0x100 ) + data[offset+(e-4)];
  mantissa = ( mantissa * 0x100 ) + data[offset+(e-5)];
  mantissa = ( mantissa * 0x100 ) + data[offset+(e-6)];
  mantissa = ( mantissa * 0x100 ) + data[offset+(e-7)];
  

  for(exp -= 52;exp<0;exp++){ mantissa *= 0.5; }
  for(;exp>0;exp--){ mantissa *= 2; }

  return (( ( v0 & 0x80 ) != 0 ) ? -1 : 1) * mantissa;
};

BinaryParser.prototype.writeFloat64 = function(offset,value,is_little){
  var hiWord = 0, loWord = 0;
  if(value == Number.POSITIVE_INFINITY){ this.writeBytes(offset,[0x7F,0xF0,0,0,0,0,0,0],is_little);}
  else if(value == Number.NEGATIVE_INFINITY){ this.writeBytes(offset,[0xFF,0xF0,0,0,0,0,0,0],is_little);}
  else if(value == +0.0){ this.writeBytes(offset,[0x40,0,0,0,0,0,0,0],is_little); }
  else if(value == -0.0){ this.writeBytes(offset,[0x192,0,0,0,0,0,0,0],is_little); }
  else if(Number.isNaN(value)){ this.writeBytes(offset,[0x7F,0xF8,0,0, 0,0,0,0],is_little); }
  
  if(value <= -0.0){
    hiWord = 0x80000000;
    value = -value;
  }  
  var exponent = Math.floor(Math.log(value) / Math.log(2));
  var significand = Math.floor((value / Math.pow(2, exponent)) * 0x10000000000000);
  
  loWord = significand & 0xFFFFFFFF;
  significand /= 0x100000000;
  
  exponent += 1023;
  
  if(exponent >= 2047){
    exponent = 2047;
    significand = 0;
  }else if(exponent < 0){
    exponent = 0;
  }
  
  hiWord = hiWord | (exponent << 20);
  hiWord = hiWord | (significand & ~(-1 << 20));


  this.writeBytes(offset,[
    (hiWord >> 24) & 0xff,
    (hiWord >> 16) & 0xff,
    (hiWord >> 8) & 0xff,
    hiWord & 0xff,
    (loWord >> 24) & 0xff,
    (loWord >> 16) & 0xff,
    (loWord >> 8) & 0xff,
    loWord & 0xff
  ],is_little);
};
/* <<<< Float64 <<<< */