/*
 * BadGuy Class, extends the Phaser sprite class
 * @param game the game objct for use in the instnance
 * @param textrue the texture to use to draw the sprite
 * @param player the player sprite to be used for game logic
*/
var BadGuy = function(game, texture, player, index){
  this.player = player;
  this.index = index;
  this.game = game;
  this.movementStack = new Array();
  this.state = "dosile";
  this.visionCone = game.add.bitmapData(game.world.width, game.world.height);
  
  this.visionCone.addToWorld();

  this.heading = {
    x: 0,
    y: 0
  };
  this.oldHeading = {
    x: 0,
    y: 0
  };

  this.goal = game.add.sprite(this.heading.x, this.heading.y, 'ball');

  this.goal.anchor = {
    x: 0.5,
    y: 0.5
  };

  // Get new random point to place the bad guy in the world
  var rand = new RandPoint();

  rand.x += 100;
  rand.y += 100;
  // Call the Sprite constructor using the JS.prototype call function
  Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, texture);


  
  var _this = this;
  var _world = game.world;

  this.rotation = Math.floor(Math.random() * 2*Math.PI );

  // update heading function, creates a new heading ahead of the npc 
  this.updateHeading = function(){

    var angle = 90;
    var distance = 200;

    _this.oldHeading.x = _this.position.x + Math.cos(_this.rotation) * distance;
    _this.oldHeading.y = _this.position.y + Math.sin(_this.rotation) * distance;
    
    if(_this.state == "dosile"){
      
      var offsetAngle = (Math.floor(Math.random() * angle) -  angle/2) * (Math.PI / 180);

      

      var coneX = _this.position.x + Math.cos(_this.rotation + offsetAngle) * distance;
      var coneY = _this.position.y + Math.sin(_this.rotation + offsetAngle) * distance;

      this.line = new Phaser.Line(_this.position.x, _this.position.y, Math.cos(_this.rotation) * distance, Math.cos(_this.rotation) * distance);

      // if the new heading is outside the world we need to grab a new one
      sanitized = areYouOutside(coneX, coneY, _world);
      coneX = sanitized.x;
      coneY = sanitized.y;

      _this.heading = {
        x: coneX,
        y: coneY
      };
      // rotate the npc towards the new heading
      _this.goal.position.x = coneX;
      _this.goal.position.y = coneY;
      _this.movementStack = [];
      // get 60 step coords to move npc toward new heading
      for(var i = 1; i <= 60; i++){
        _this.movementStack.push(lerp(_this.heading, _this.oldHeading, i/60));
      }
    } else if(_this.state == "alert") {
      _this.heading = {
        x: _this.position.x,
        y: _this.position.y
      }
      _this.movementStack = [];
      
    }

    

    
  }
  this.updateHeading();
  
  //set central anchor point.

  this.anchor = {
    x: 0.5,
    y: 0.5
  }
  game.physics.enable(this);

  
  
}

/*
 * Send extended object back to the Sprite object
 */
BadGuy.prototype = Object.create(Phaser.Sprite.prototype);

/*
 * Override the sprite constructor for new instances of the class
 */
BadGuy.prototype.constructor = BadGuy;

/*
 * Phaser will call any game objects update function on game.update
 */
BadGuy.prototype.update = function(){

  var angle = findAngle(this.position, this.player.position, this.rotation);
  var VISION_ANGLE = 60;
  var VISION_LENGTH = 200;
  if(Math.abs(angle * (180 / Math.PI)) < VISION_ANGLE && findDistance(this.player.position, this.position, this.rotation) < 200){
    this.state = "alert";
  } else {
    this.state = "dosile";
  }

  Phaser.Sprite.prototype.update.call(this);

  if(this.state == "alert"){
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      var dx = this.player.x - this.position.x;
      var dy = this.player.y - this.position.y;
      this.rotation = Math.atan2(dy, dx);
    

  } else {
    ask({prob: 20, func: this.updateHeading, params: this});

    var coord;
    if(coord = this.movementStack.pop()){
      game.physics.arcade.moveToXY(this, coord.x, coord.y);
      var dx = coord.x - this.position.x;
      var dy = coord.y - this.position.y;
      this.rotation = Math.atan2(dy, dx);
    } else {
      
      game.physics.arcade.moveToXY(this, this.heading.x, this.heading.y);
    
      var dx = this.heading.x - this.position.x;
      var dy = this.heading.y - this.position.y;
      this.rotation = Math.atan2(dy, dx);
      
      
    }

  }
  var angle = VISION_ANGLE * (Math.PI / 180);
  var coneX = this.position.x + Math.cos(this.rotation + angle) * VISION_LENGTH;
  var coneY = this.position.y + Math.sin(this.rotation + angle) * VISION_LENGTH;
  var coneMidX = this.position.x + Math.cos(this.rotation) * VISION_LENGTH * 1.3;
  var coneMidY = this.position.y + Math.sin(this.rotation) * VISION_LENGTH * 1.3;
  var coneX2 = this.position.x + Math.cos(this.rotation - angle) * VISION_LENGTH;
  var coneY2 = this.position.y + Math.sin(this.rotation - angle) * VISION_LENGTH;
  this.visionCone.clear();
  this.visionCone.context.beginPath();
  this.visionCone.context.fillStyle = 'rgba(255, 255, 255, 0.3)';
  this.visionCone.context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  this.visionCone.context.moveTo(this.position.x, this.position.y);
  this.visionCone.context.lineTo(coneX, coneY);
  
  this.visionCone.context.quadraticCurveTo(coneMidX, coneMidY, coneX2, coneY2);

  this.visionCone.context.closePath();
  this.visionCone.context.fill();
  this.visionCone.dirty = true;

}

var BadGuys = function(game, amnt, texture, player){
  Phaser.Group.call(this, game);

  this.averageCoord = {
    x: 0,
    y: 0
  }
  
  for(var i = 0; i < amnt; i++){
    var aBadGuy = new BadGuy(game, texture, player, i);
    var sprite = this.add(aBadGuy);
  }

  game.physics.enable(this);

}

BadGuys.prototype = Object.create(Phaser.Group.prototype);
BadGuys.prototype.constructor = BadGuys;

BadGuys.prototype.update = function(){
  Phaser.Group.prototype.update.call(this);
  var xs = 0;
  var ys = 0;
  var _this = this;

  this.forEach(function(item){
    xs += item.position.x;
    ys += item.position.y;
  });
  this.averageCoord = {
    x: xs / this.length,
    y: ys / this.length
  }
}