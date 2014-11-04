/*
 * Follower Class, extends the Phaser sprite class
 * @param game the game objct for use in the instnance
 * @param textrue the texture to use to draw the sprite
 * @param player the player sprite to be used for game logic
*/
var Follower = function(game, texture, player){
  this.player = player;
  // Call the Sprite constructor using the JS.prototype call function
  Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, texture);
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
  var me = this;
  var deltas = {
      original: {
          x: 0,
          y: 0
      },
      update: {
          x: 0,
          y: 0
      }
  }
  // Diferentiate the position of the Follower from the player
  deltas.original.y = this.player.y - me.position.y;
  deltas.original.x = this.player.x - me.position.x;

  // get two random ponits
  var rand1 = new randPoint();
  var rand2 = new randPoint();

  // add and subtract the random x and y to the current difference
  deltas.update.y = deltas.original.y + rand1.y - rand2.y;
  deltas.update.x = deltas.original.x + rand1.x - rand2.x
  angle = Math.atan2(deltas.original.y, deltas.original.x);
  me.rotation = angle;
  me.body.velocity.x = deltas.update.x;
  me.body.velocity.y = deltas.update.y;
}

var Followers = function(game, amnt, texture, player){
  Phaser.Group.call(this, game)
  
  for(var i = 0; i < amnt; i++){
    var follower = new Follower(game, texture, player);
    var sprite = this.add(follower);
  }

}

Followers.prototype = Object.create(Phaser.Group.prototype);
Followers.prototype.constructor = Followers;