/*
 * Follower Class, extends the Phaser sprite class
 * @param game the game objct for use in the instnance
 * @param textrue the texture to use to draw the sprite
 * @param player the player sprite to be used for game logic
*/
var Follower = function(game, texture, player ,position){
  this.player = player;
  this.index = position;
  this.heading = {
    x: 0,
    y: 0
  }
  

  var _this = this;

  this.updateHeading = function(){
    var rand = new RandPoint();
    _this.heading = {
      x: _this.player.x - _this.position.x + rand.x,
      y: _this.player.y - _this.position.y + rand.y
    }

    
  }
  var rand = new RandPoint();

  rand.x += 100;
  rand.y += 100;
  // Call the Sprite constructor using the JS.prototype call function
  Phaser.Sprite.call(this, game, rand.x, rand.y, texture);

  //set central anchor point.

  _this.anchor = {
    x: 0.5,
    y: 0.5
  }
  game.physics.enable(this);

  
  
}

/*
 * Send extended object back to the Sprite object
 */
Follower.prototype = Object.create(Phaser.Sprite.prototype);

/*
 * Override the sprite constructor for new instances of the class
 */
Follower.prototype.constructor = Follower;

/*
 * Phaser will call any game objects update function on game.update
 */
Follower.prototype.update = function(){
  

}

var Followers = function(game, amnt, texture, player){
  Phaser.Group.call(this, game);

  this.averageCoord = {
    x: 0,
    y: 0
  }
  
  for(var i = 0; i < amnt; i++){
    var follower = new Follower(game, texture, player, i);
    var sprite = this.add(follower);
  }

}

Followers.prototype = Object.create(Phaser.Group.prototype);
Followers.prototype.constructor = Followers;

Followers.prototype.update = function(){

  console.log(this.averageCoord);
  var xs = 0;
  var ys = 0;
  var _this = this;
  this.forEach(function(item){
    xs += item.position.x;
    ys += item.position.y;
    ask({prob: 20, func: item.updateHeading, params: item});
    if(item.index == -1){
      item.rotation = Math.atan2(item.player.y - item.position.y, item.player.x - item.position.x);
      item.body.velocity.x = item.heading.x;
      item.body.velocity.y = item.heading.y;
    } else {
      item.rotation = Math.atan2(_this.averageCoord.y, _this.averageCoord.x);
      item.body.velocity.x = _this.averageCoord.x;
      item.body.velocity.y = _this.averageCoord.y;
    }
  });
  this.averageCoord = {
    x: xs / this.length,
    y: ys / this.length
  }
}