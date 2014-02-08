function BinaryStream(){
  this.map = [];      //Container
  this.position = 0;  //Bit position in the stream
  this.length = 0;    //Total bits in stream
};


BinaryStream.prototype.close = function(){
  this.position = 0;
};




/*----------Bit Operation----------*/

var BIT_REVERSE = [
  0x00, 0x80, 0x40, 0xC0, 0x20, 0xA0, 0x60, 0xE0, 0x10, 0x90, 0x50, 0xD0, 0x30, 0xB0, 0x70, 0xF0, 
  0x08, 0x88, 0x48, 0xC8, 0x28, 0xA8, 0x68, 0xE8, 0x18, 0x98, 0x58, 0xD8, 0x38, 0xB8, 0x78, 0xF8, 
  0x04, 0x84, 0x44, 0xC4, 0x24, 0xA4, 0x64, 0xE4, 0x14, 0x94, 0x54, 0xD4, 0x34, 0xB4, 0x74, 0xF4, 
  0x0C, 0x8C, 0x4C, 0xCC, 0x2C, 0xAC, 0x6C, 0xEC, 0x1C, 0x9C, 0x5C, 0xDC, 0x3C, 0xBC, 0x7C, 0xFC, 
  0x02, 0x82, 0x42, 0xC2, 0x22, 0xA2, 0x62, 0xE2, 0x12, 0x92, 0x52, 0xD2, 0x32, 0xB2, 0x72, 0xF2, 
  0x0A, 0x8A, 0x4A, 0xCA, 0x2A, 0xAA, 0x6A, 0xEA, 0x1A, 0x9A, 0x5A, 0xDA, 0x3A, 0xBA, 0x7A, 0xFA,
  0x06, 0x86, 0x46, 0xC6, 0x26, 0xA6, 0x66, 0xE6, 0x16, 0x96, 0x56, 0xD6, 0x36, 0xB6, 0x76, 0xF6, 
  0x0E, 0x8E, 0x4E, 0xCE, 0x2E, 0xAE, 0x6E, 0xEE, 0x1E, 0x9E, 0x5E, 0xDE, 0x3E, 0xBE, 0x7E, 0xFE,
  0x01, 0x81, 0x41, 0xC1, 0x21, 0xA1, 0x61, 0xE1, 0x11, 0x91, 0x51, 0xD1, 0x31, 0xB1, 0x71, 0xF1,
  0x09, 0x89, 0x49, 0xC9, 0x29, 0xA9, 0x69, 0xE9, 0x19, 0x99, 0x59, 0xD9, 0x39, 0xB9, 0x79, 0xF9, 
  0x05, 0x85, 0x45, 0xC5, 0x25, 0xA5, 0x65, 0xE5, 0x15, 0x95, 0x55, 0xD5, 0x35, 0xB5, 0x75, 0xF5,
  0x0D, 0x8D, 0x4D, 0xCD, 0x2D, 0xAD, 0x6D, 0xED, 0x1D, 0x9D, 0x5D, 0xDD, 0x3D, 0xBD, 0x7D, 0xFD,
  0x03, 0x83, 0x43, 0xC3, 0x23, 0xA3, 0x63, 0xE3, 0x13, 0x93, 0x53, 0xD3, 0x33, 0xB3, 0x73, 0xF3, 
  0x0B, 0x8B, 0x4B, 0xCB, 0x2B, 0xAB, 0x6B, 0xEB, 0x1B, 0x9B, 0x5B, 0xDB, 0x3B, 0xBB, 0x7B, 0xFB,
  0x07, 0x87, 0x47, 0xC7, 0x27, 0xA7, 0x67, 0xE7, 0x17, 0x97, 0x57, 0xD7, 0x37, 0xB7, 0x77, 0xF7, 
  0x0F, 0x8F, 0x4F, 0xCF, 0x2F, 0xAF, 0x6F, 0xEF, 0x1F, 0x9F, 0x5F, 0xDF, 0x3F, 0xBF, 0x7F, 0xFF
];


/* >>>> Bits >>>> */

BinaryStream.prototype.reverseSign = function(){
  var map = this.map;
  for(var i=0,length=map.length;i<length;i++){
    map[i] = BIT_REVERSE[ map[i] ];
  }
  
};

BinaryStream.prototype.bitShift = function(value){
  this.position += value;
};

BinaryStream.prototype.byteShift = function(value){
  this.position += value*8;
};

BinaryStream.prototype.startByte = function(){  //
  var p = this.position;
  
  
  if((p & 0x7) !== 0){
    p += 8-(p&0x7);
    this.position = p;
  }
  
  
};

BinaryStream.prototype.readBit = function(){
  var p = this.position++;
  
  return (this.map[p >> 3] >> (p & 0x7 ^ 0x7)) & 0x1; 
};

BinaryStream.prototype.readBits = function(length,reversed){
  var map = this.map;  
  var p = this.position;
  
  if(p+length>this.length){ return -1; }
  if(length<1 || length>32){ throw new Error('Length must be in range 0-32'); }
  
  var value = 0;;
  var byte = map[p >> 3];
  var bit;
  var i=0;

  if(reversed){
    for(;i<length;i++,p++){
      
      bit = p & 0x7 ^ 0x7;
      
      value |= ((byte >> bit ) & 0x1) << i;
    
      if(bit === 0){
        byte = map[p+1 >> 3];
      }
    }  
  }else{
    for(;i<length;i++,p++){
      bit = p & 0x7 ^ 0x7;
      value = (value << 1) | ((byte >> bit ) & 0x1);
    
      if(bit === 0){
        byte = map[p+1 >> 3];
      }
    }
  }
  
  this.position = p;

  return value;
};


BinaryStream.prototype.writeBits = function(bits){
  var map = this.map;  
  var p = this.position;
  var bit, byte = map[p>>3];

  var length = bits.length;
   
   
  for(var i=0;i<length;i++,p++){
    bit = p & 0x7;
    
    byte |= (bits[i] & 0x1) << (bit ^ 0x7);
    
    if(bit === 7){
      map[p >> 3] = byte;
      byte = 0;
    }
  }
  
  if((p & 0x7) !== 0){
    map[p >> 3] = byte;
  }

  this.position = p;
  this.length += length;    
};
/* <<<< Bits <<<< */

/* >>>> Bytes >>>> */
BinaryStream.prototype.readBytes = function(length){
  var map = this.map;
  var p  = this.position >> 3;
  
  if((p+length << 3) > this.length){ throw new Error('Out of bounds');}
  
  var data = new Array(length);
  
  for(var i=0;i<length;i++){
    data[i] = map[p++];
  }
  
  this.position += length*8;
  
  return data;
};

BinaryStream.prototype.writeBytes = function(bytes,reversed){
  var map = this.map;
  
  var p = this.position;
  var offset = p&0x7;
  var inv_offset = (offset^7)+1;

  var write_byte = map[p>>3];
  var read_byte;
  
  var length = bytes.length;

  if(reversed){
    for(var i=0;i<length;p+=8,i++){
      map[p>>3] = BIT_REVERSE[bytes[i]];
    }
    /*for(var i=0;i<length;p+=8,i++){
      read_byte = BIT_REVERSE[bytes[i]];
      map[p>>3] = (write_byte | (read_byte >> offset)) & 0xFF;
      write_byte = (read_byte << inv_offset) & 0xFF;    
    }*/
  }else{
    for(var i=0;i<length;p+=8,i++){
      map[p>>3] = bytes[i];
    }
    
    /*for(var i=0;i<length;p+=8,i++){
      read_byte = bytes[i];
      map[p>>3] = (write_byte | (read_byte >> offset)) & 0xFF;
      write_byte = (read_byte << inv_offset) & 0xFF;    
    }*/  
  }
  
  if((p & 0x7) !== 0){
    map[p >> 3] = write_byte;
  }
  
  this.position = p;
  this.length += length*8;  
};
/* <<<< Bytes <<<<< */


/*----------Byte Operation----------*/

/* >>>> Int8 & UInt 8 >>>> */
BinaryStream.prototype.readInt8 = function(){
  if((this.position & 0xFFFFFFF8)+8>this.length){ return -1; }
  
  var value = (this.map[this.position >> 3] << 24) >> 24;
  this.position += 8; 
  return value;  
};  

BinaryStream.prototype.readUInt8 = function(){
  if((this.position & 0xFFFFFFF8)+8>this.length){ return -1; }
  
  var value = this.map[this.position >> 3] >>> 0;
  this.position += 8; 
  return value;
};
BinaryStream.prototype.writeInt8 = function(value){
  this.map[this.position >> 3] = value & 0xFF;
  
  this.position += 8;
  this.length += 8;
      
  return this;    
};
/* <<<< Int8 & UInt 8 <<<< */

/* >>>> Int16 & UInt 16 >>>> */ 
BinaryStream.prototype.readInt16 = function(is_little){
  var p = this.position >> 3;
  if((this.position & 0xFFFFFFF8)+16>this.length){ return -1; }

  var map = this.map;
  
  this.position += 16;
  
  return (is_little === true ? 
         (map[p+1] << 8) + map[p] : 
         (map[p] << 8) + map[p+1]);
};  

BinaryStream.prototype.readUInt16 = function(is_little){
  var p = this.position >> 3;
  if((this.position & 0xFFFFFFF8)+16>this.length){ return -1; }

  var map = this.map;
  
  this.position += 16;
  
  return (is_little === true ? 
         (map[p+1] << 8) + map[p] : 
         (map[p] << 8) + map[p+1]) >>> 0;
};
BinaryStream.prototype.writeInt16 = function(value, is_little){
  var map = this.map;
  var p = this.position >> 3;
    
  if(is_little === true){
    map[p+1] = (value >> 8) & 0xFF;
    map[p] = value & 0xFF;  
  }else{
    map[p] = (value >> 8) & 0xFF;
    map[p+1] = value & 0xFF;
  }  

  this.position += 16;
  this.length += 16;

  return this;    
};
/* <<<< Int16 & UInt 16 <<<< */

/* >>>> Int32 & UInt 32 >>>> */
BinaryStream.prototype.readInt32 = function(is_little){
  var p = this.position >> 3;
  if((this.position & 0xFFFFFFF8)+32>this.length){ return -1; }

  var map = this.map;
  
  this.position += 32;
  
  return is_little === true ? 
         (map[p+3] << 24) + (map[p+2] << 16) + (map[p+1] << 8) + map[p] : 
         (map[p] << 24) + (map[p+1] << 16) + (map[p+2] << 8) + map[p+3];
};

BinaryStream.prototype.readUInt32 = function(is_little){
  var p = this.position >> 3;
  if((this.position & 0xFFFFFFF8)+32>this.length){ return -1; }

  var map = this.map;
  
  this.position += 32;  
  
  return (is_little === true ? 
         (map[p+3] << 24) + (map[p+2] << 16) + (map[p+1] << 8) + map[p] : 
         (map[p] << 24) + (map[p+1] << 16) + (map[p+2] << 8) + map[p+3]) >>> 0;
};

BinaryStream.prototype.writeInt32 = function(value, is_little){
  var map = this.map;
  var p = this.position >> 3;
  
  if(is_little === true){
    map[p+3] = (value >> 24) & 0xFF;
    map[p+2] = (value >> 16) & 0xFF;
    map[p+1] = (value >> 8) & 0xFF;
    map[p] = value & 0xFF;  
  }else{
    map[p] = (value >> 24) & 0xFF;
    map[p+1] = (value >> 16) & 0xFF;
    map[p+2] = (value >> 8) & 0xFF;
    map[p+3] = value & 0xFF;  
  }
  
  this.position += 32;
  this.length += 32;
  
  return this;    
};
/* <<<< Int32 & UInt 32 <<<< */





/* >>>> Float32 >>>> */
BinaryStream.prototype.readFloat32 = function(is_little){
  var p = this.position >> 3;
  if((this.position & 0xFFFFFFF8)+32>this.length){ return -1; }

  var map = this.map;
  var b80 = 0x800000;
  
  var int32 = (is_little === true ? 
              (map[p+3] << 24) + (map[p+2] << 16) + (map[p+1] << 8) + map[p] : 
              (map[p] << 24) + (map[p+1] << 16) + (map[p+2] << 8) + map[p+3]);
         
  var exponent = ((int32 >> 23) & 0xFF) - 127;
  var significand = (int32 & ~-b80);

  if(exponent == 0x80){ 
    return significand ? Number.NaN : Number.POSITIVE_INFINITY;
  }
  if(exponent == -0x7F){
    if (significand == 0){ return 0; }
    exponent = -0x7E;
    significand /= 0x400000;
  }else{
    significand = (significand | b80) / b80;
  }
  
  this.position += 32; 
  
  return ((int32 & 0x80000000) ? -1 : 1) * significand * Math.pow(2, exponent);
};

BinaryStream.prototype.writeFloat32 = function(value,is_little){
  throw new Error('not complete');
  var bytes = 0;
  
  if(value == Infinity){ this.writeBytes(offset,[0x7F,0x80,0,0],is_little); return; }
  else if(value == -Infinity){ this.writeBytes(offset,[0xFF,0x80,0,0],is_little); return; }
  else if(value == 0){ this.writeBytes(offset,[0,0,0,0],is_little); return; }
  else if(value == NaN){ this.writeBytes(offset,[0x7F,0xC0,0,0],is_little); return; }
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
  
  if(is_little){
    this.map[offset+3] = (bytes >> 24) & 0xFF;
    this.map[offset+2] = (bytes >> 16) & 0xFF;
    this.map[offset+1] = (bytes >> 8) & 0xFF;
    this.map[offset] = bytes & 0xFF; 
  }else{
    this.map[offset] = (bytes >> 24) & 0xFF;
    this.map[offset+1] = (bytes >> 16) & 0xFF;
    this.map[offset+2] = (bytes >> 8) & 0xFF;
    this.map[offset+3] = bytes & 0xFF;
  }
  
  return this; 
};
/* <<<< Float32 <<<< */

/* >>>> Float64 >>>> */
BinaryStream.prototype.readFloat64 = function(is_little){
  throw new Error('not complete');
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

BinaryStream.prototype.writeFloat64 = function(value,is_little){
  throw new Error('not complete');
  var hiWord = 0, loWord = 0;
  if(value == Number.POSITIVE_INFINITY){ this.writeBytes(offset,[0x7F,0xF0,0,0,0,0,0,0],is_little);}
  else if(value == Number.NEGATIVE_INFINITY){ this.writeBytes(offset,[0xFF,0xF0,0,0,0,0,0,0],is_little);}
  else if(value == +0.0){ this.writeBytes(offset,[0x40,0,0,0,0,0,0,0],is_little); }
  else if(value == -0.0){ this.writeBytes(offset,[0x192,0,0,0,0,0,0,0],is_little); }
  else if(Number.isNaN(value)){ this.writeBytes(offset,[0x7F,0xF8,0,0, 0,0,0,0],is_little); }
  
  if(value <= 0){
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







/* >>>> Ascii & AsciiZ >>>> */
BinaryStream.prototype.readAscii = function(length){
  var data = this.map;
  var p = this.position >> 3;
  var olength = length + p;
  var d;

  for(var str = '';p<olength;p++){
    d = data[p];
    
    if((d & 0xF0) == 0xF0){
      d = ((d & 0x7) << 6);
      d |= (data[++p] & 0x3F);
      d |= (data[++p] & 0x3F);
      d |= (data[++p] & 0x3F);  
    }else if((d & 0xE0) == 0xE0){
      d = ((d & 0xF) << 6);
      d |= (data[++p] & 0x3F);
      d |= (data[++p] & 0x3F);      
    }else if((d & 0xC0) == 0xC0){
      d = ((d & 0x1F) << 6)
      d |= (data[++p] & 0x3F);
    }
    
    str += String.fromCharCode(d);
  }  
  
  this.position += length*8;
  
  return str;
};
BinaryStream.prototype.readAsciiZ = function(max_length){
  var data = this.map;
  var p = this.position >> 3;             
  var length = (max_length || data.length)+p;

  for(var s,str='';p<length;p++){
    s = data[p];

    if(s == 0x0){ 
      this.position += (str.length+1) * 8; 
      return str; 
    }
    
    str += String.fromCharCode(s);
  }  
  
  this.position += p*8;
  
  return false;
};

BinaryStream.prototype.writeAscii = function(string){
  var data = this.map;
  var p = this.position >> 3;
  var length = string.length;

  for(var f=0;f<length;f++,p++){
    data[p] = string.charCodeAt(f) & 0xFF;
  }  
                            
  this.position += length*8;
  this.length += length*8;
};
/* <<<< Ascii & AsciiZ <<<< */


/* >>>> Namespaces >>>> */
BinaryStream.prototype.readCHAR = BinaryStream.prototype.readAscii;
BinaryStream.prototype.readWORD = BinaryStream.prototype.readUInt16;
BinaryStream.prototype.readDWORD = BinaryStream.prototype.readUInt32;
BinaryStream.prototype.readULONG = BinaryStream.prototype.readUInt32;
/* <<<< Namespace <<<< */

/* >>>> Functions >>>> */
BinaryStream.FromString = function(str){
  var stream = new BinaryStream();
  stream.writeAscii(str);
  stream.position = 0;
   
  return stream; 
};
BinaryStream.FromByteArray = function(bytes){
  var stream = new BinaryStream();
  stream.map = bytes;
  stream.length = bytes.length*8;
  stream.position = 0;
    
  return stream;
}
/* <<<< Functions <<<< */