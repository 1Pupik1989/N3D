var LSystem = function(data,ctx){
  this.ctx = ctx;
  
  
  var that = this;
  this.iterate = typeof data.iterate !== "undefined" ? data.iterate : 1;
  
  var yaw = data.yaw || [0,0];
  this.yawLeft = -yaw[0] * $Math.PiOver180;
  this.yawRight = yaw[1] * $Math.PiOver180;
  
  this.lineLength = data.lineLength || 1;
  this.point = data.point || new $V4(0,0,0,1);
  this.rotationMatrix = new $M4();

  this.bin = [];
  
  var rules = data.rules;
  var alphabet = data.alphabet;
  
  this.setRules(rules).setActions(alphabet).generateProcess(data.axiom);
  

  
};
LSystem.prototype = {
  drawLine:function(){
    var ctx = this.ctx;
    var v = this.point;
    ctx.beginPath();
    ctx.moveTo(v.x,v.y);
    this.moveForward();
    v = this.point;
    ctx.lineTo(v.x,v.y);
    ctx.stroke();
  },
  moveForward:function(){
    this.point.add(new $V4(this.lineLength,0,0,0).multiplyMatrix4(this.rotationMatrix));
  },
  rotateYaw:function(v){
    this.rotationMatrix.rotateZ(v);
  },
  pushBin:function(){
    this.bin.push({
      point:this.point.clone(),
      rotationMatrix:this.rotationMatrix.clone()
    });
  },
  popBin:function(){
    var bin = this.bin[this.bin.length-1];
    this.point = bin.point;
    this.rotationMatrix = bin.rotationMatrix;
    this.bin.splice(this.bin.length-1,1);
  },
  savePolygon:function(){
  
  },
  loadPolygon:function(){
  
  },
  
  
  
  
  start:function(){
    var process = this.process;
    var length = process.length;
    for(var i=0;i<length;i++){
      var command = process[i];
      this.command = command;

      (this.actions[command] || function(){console.log(command+" not found");}).call(this);
      
    }
  },
  
  generateProcess:function(str){
    var that = this;
    var reg = new RegExp(this.alphabet.join("|"),"g");
    var rules = this.rules;
    var iterate = this.iterate;

    for(var j=0;j<iterate;j++){
      str = str.replace(reg,function(match, offset, full){
        console.log(match);
        return rules[match].join("");
      });
      
    }
    
    console.log(this.property);
    console.log(this.addProperty);
    this.process = str.match(/[A-U0-9]\(?[^\)]*\)?|[\+\-\[\]\{\}]/g);
    
    //var addRules = str.match(/[A-U0-9]\(([^\)]+)\)/);
    //console.log(addRules);
    
  },
  setRules:function(rules){
    var rules = rules.split(";");
    var rules_length = rules.length;
    var store = this.rules = {};
    
    var key = this.alphabet = [];
    
    for(var i=0;i<rules_length;i++){
      var r = rules[i].split("=");
      if(r[1]){
        key.push(r[0].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        
        store[ r[0] ] = r[1].match(/[A-U0-9]\(?[^\)]*\)?|[\+\-\[\]\{\}]/g);
      } 
    }
    
    return this;
  },
  setActions:function(alphabet){
    var alpha_str = alphabet;
    var alphabet = alphabet.split(" ");
    var alphabet_length = alphabet.length;
    
    var actions = [
      [/([A-U0-9])\(([^\)]+)\)/, function(){ console.log("test"); }],
      [/\+/,       function(){ this.rotateYaw(this.yawLeft); } ],
      [/\-/,       function(){ this.rotateYaw(this.yawRight); } ],
      [/\[/,       this.pushBin],
      [/\]/,       this.popBin],
      [/\{/,       function(){ this.savePolygon(); }],
      [/\}/,       function(){ this.loadPolygon(); }],
      [/[A-U0-9]/, this.drawLine ]
      
    ];
    
    this.property = {};
    this.addProperty = {};
    var actions_length = actions.length;
    var that_actions = this.actions = {};
    
    for(var i=0;i<alphabet_length;i++){
      var j=0;
      var alpha = alphabet[i];
      
      while(j<actions_length){
        var action = actions[j];

        if(reg = alpha.match(action[0])){
          that_actions[alpha] = action[1];
          if(reg[1]){
            this.property[ reg[2] ] = null;
            this.addProperty[ reg[1] ] = reg[2];
          }
          break;
        }
        j++;  
      }
    }
    
    
    //console.log(this.property);
    //this.rules_regexp = new RegExp(rules_regexp.join("|"),"g");
    //console.log(this.actions);
    return this;
  }
};


N3D.Geometry.Trees = function(ctx){
  ctx.strokeStyle = "green";

  var start_time = +Date.now();

  var test = new LSystem({
    /*rules:"M=O++{.P.----N.[-O.----M.}]++;N=+{.O.--P.[---M.--N.}]+;O=-{.M.++N.[+++O.++P.}]-;P=--{.O.++++M.[+P.++++N.}]--N",
    axiom:"[N]++[N]++[N]++[N]++[N]",
    alphabet:"M N O P + - [ ] { . }", */
    /*rules:"X=C0FF+[C1+F]+[C3-F];F=C0FF-[C1-F+F]+[C2+F-F]",
    alphabet:"X C F 0 1 2 3 [ ] + -",
    axiom:"FX",*/
    /*rules:"F=C0FF-[C1-F+F+F]+[C2+F-F-F]",
    alphabet:"F C 0 1 2 3 [ ] + -",
    axiom:"F", */
    rules:"F(l)=H(l)[+F(l*R)][-F(l*R)]",
    axiom:"F(200)",
    alphabet:"F(l) H(l) [ ] + -",
    //alphabet:":",
    point:new $V4(500,1000,0,1),
    yaw:[22,22],
    lineLength:2,
    iterate:5
  },ctx);
  
  test.rotationMatrix.rotateZ(90 * $Math.PiOver180);
  test.start();
  var end_time = +Date.now();
  console.log(end_time-start_time);
};
