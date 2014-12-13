window.onload = function() {
  var width = 100;
  var height = 100;
  var counter = 0;
  game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

  function preload() {
    game.load.tilemap('desert', createJSON(width, height) , null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'images/new_map.png');
    game.load.image('car', 'images/car90.png');
    game.load.image('goodGuy', 'images/goodGuy.png');
    game.load.image('badGuy', 'images/badGuy.png');
    game.load.image('ball', 'images/heading.png');
    game.load.image('round', 'images/round.png');
    game.load.image('mine', 'images/mine.png');
    game.load.image('healthbar', 'images/healthbar.png');
    game.time.advancedTiming = true;

  }


  var FOLLOWER_AMNT = 0;

  var BAD_GUY_AMNT = 20;
  var map;
  var layer;

  var cursors;

  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('desert');

    map.addTilesetImage('Desert', 'tiles');

    layer = map.createLayer('Ground');

    layer.resizeWorld();

    game.player = new Hero(game, 'goodGuy');
    game.player = game.add.existing(game.player);
    game.followerGroup = new Followers(game, FOLLOWER_AMNT, 'car');
    game.badGuyGroup = new BadGuys(game, BAD_GUY_AMNT, 'badGuy');
    game.boids = new Boids(game);

    

    map.setTileIndexCallback(1, collide, this, layer);
    map.setTileIndexCallback(2, collide, this, layer);

    game.killCount = 0;

  }

  function collide(dude, layer){
    dude.setOnWater(layer.index == 2);
  }

  function update() {
    
    game.physics.arcade.collide(game.followerGroup, game.followerGroup);
    game.physics.arcade.collide(game.badGuyGroup, game.badGuyGroup);
    
    this.game.physics.arcade.collide(game.player, layer, collide);

  }

  function render() {

    
    game.debug.text('Lives: ' + game.player.health, 32, 64, 'rgb(0,255,0)');
    game.debug.text('Kill Count: ' + game.killCount, 32, 32, 'rgb(0,255,0)');

  }

};