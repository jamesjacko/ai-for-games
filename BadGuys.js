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
  Phaser.Sprite.call(this, game, 300, 300, texture);


  
  var _this = this;
  var _world = game.world;

  this.rotation = Math.floor(Math.random() * 2*Math.PI );

  // update heading function, creates a new heading ahead of the npc 
  this.updateHeading = function(){

    
    
    var angle = 90;
    var distance = 200;
    var offsetAngle = (Math.floor(Math.random() * angle) -  angle/2) / (180 * Math.PI);

    _this.oldHeading.x = _this.position.x + Math.cos(_this.rotation) * distance;
    _this.oldHeading.y = _this.position.y + Math.sin(_this.rotation) * distance;

    var coneX = _this.position.x + Math.cos(_this.rotation + offsetAngle) * distance;
    var coneY = _this.position.y + Math.sin(_this.rotation + offsetAngle) * distance;

    // if the new heading is outside the world we need to grab a new one
    if(areYouOutside(coneX, coneY, _world)){
      console.log("now");
      coneX *= -1;
      coneY *= -1;
    }
    _this.heading = {
      x: coneX,
      y: coneY
    };
    // rotate the npc towards the new heading
    _this.goal.position.x = coneX;
    _this.goal.position.y = coneY;

    
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
  Phaser.Sprite.prototype.update.call(this);

  ask({prob: 20, func: this.updateHeading, params: this});

  

  game.physics.arcade.moveToXY(this, this.heading.x, this.heading.y);
  var dx = this.heading.x - this.position.x;
  var dy = this.heading.y - this.position.y;
  this.rotation = Math.atan2(dy, dx);
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