function Boid(game, texture, index, vel){
  


// The number of birds ("boids") flying around the screen
this.maxVelocity = vel;

this.n = index;
this.xVelocity = Math.floor(Math.random() * this.maxVelocity * 2) - this.maxVelocity;
this.yVelocity = Math.floor(Math.random() * this.maxVelocity * 2) - this.maxVelocity;

Phaser.Sprite.call(this, game, Math.floor(Math.random() * this.maxVelocity * 10), Math.floor(Math.random() * this.maxVelocity * 10), texture);
game.physics.enable(this);

}

/*
 * Send extended object back to the Sprite object
 */
Boid.prototype = Object.create(Phaser.Sprite.prototype);

/*
 * Override the sprite constructor for new instances of the class
 */
Boid.prototype.constructor = Boid;

/*
 * Phaser will call any game objects update function on game.update
 */
Boid.prototype.update = function(){
  this.body.velocity.x = this.xVelocity;
  this.body.velocity.y = this.yVelocity;
};

var Boids = function(game){
  this.numBoids = 50;

  this.maxVelocity = 5;
  this.minSafeDistance = 25;
  this.minY = 0;
  this.maxY = game.world.height;
  this.minX = 0;
  this.maxX = game.world.width;

  this.followFlockTendency = 0.3;

  this.aimAtFlockCenterTendency = 0.3;

  var _this = this;

  // Return the distance between two points (dX, dY, and dZ
  // are the differences between x, y, and z coordinates of the
  // two points).
  this.distance = function(dX, dY) {
    return Math.sqrt((dX * dX) + (dY * dY)) * 1.0;
  };


  this.distanceBetween = function(boidA, boidB) {
    return this.distance(
      boidA.position.x - boidB.position.x,
      boidA.position.y - boidB.position.y
      );
  };

  this.areBoidsTooClose = function(boid, otherBoid, safeDist) {
    return this.distanceBetween(boid, otherBoid) < safeDist;
  };

  // This function is called once per animation for each boid.
  // It makes the boid slightly adjust its direction to follow
  // the same flight direction as the rest of the flock.
  this.followFlock = function(boid) {
    var xVelocityFlock = 0;
    var yVelocityFlock = 0;
    
    // Find the average x, y, and z velocity for all other
    // boids in the flock.
    this.forEach(function(item) {
      var otherBoid = item;
      if (otherBoid.n !== boid.n) {
        xVelocityFlock += otherBoid.xVelocity;
        yVelocityFlock += otherBoid.yVelocity;
      }
    });
    
    xVelocityFlock = xVelocityFlock / this.numBoids;
    yVelocityFlock = yVelocityFlock / this.numBoids;
    
    // Compute the distance between this boid's speed and
    // the rest of the flock's average speed...
    var dist = this.distance(
      xVelocityFlock, yVelocityFlock);
    if (dist === 0) {
      return;
    }
    
    // ...and use that distance to adjust this boid's speed.
    boid.xVelocity += (xVelocityFlock / dist) * this.followFlockTendency;
    boid.yVelocity += (yVelocityFlock / dist) * this.followFlockTendency;
  };

  // This function is called once per animation for each boid.
  // It makes the boid slightly adjust its direction to head
  // into the center of the flock.
  this.aimAtCenterOfFlock = function(boid) {
    var xFromCenter = 0;
    var yFromCenter = 0;
    
    // Find the average position of the rest of the flock
    // so this boid can move into the center.
    this.forEach(function(item) {
      var otherBoid = item;
      if (otherBoid.n !== boid.n) {
        xFromCenter += boid.position.x - otherBoid.position.x;
        yFromCenter += boid.position.y - otherBoid.position.y;
      }
    });
    
    xFromCenter = xFromCenter / this.numBoids;
    yFromCenter = yFromCenter / this.numBoids;
    
    // Compute the distance between this boid's position and
    // the center of the flock...
    var dist = this.distance(xFromCenter, yFromCenter);
    if (dist === 0) {
      return;
    }
    
    // ...and use that distance to adjust this boid's position.
    boid.xVelocity += (xFromCenter / dist) * -1 * this.aimAtFlockCenterTendency;
    boid.yVelocity += (yFromCenter / dist) * -1 * this.aimAtFlockCenterTendency;
  };

  // This function is called once per animation for each boid.
  // It makes the boid avoid running into other boids.
  this.avoidOtherBoids = function(boid) {
    var xAdjustment = 0;
    var yAdjustment = 0;
    
    // Check every other boid...
    this.forEach(function(item) {
      var otherBoid = item;
      if (otherBoid.n !== boid.n) {
        
        // ...and make sure this boid isn't flying too
        // close.
        var isTooClose = _this.areBoidsTooClose(
          boid, otherBoid, _this.minSafeDistance);
        
        // If flying too close, adjust this boid's velocity
        // so it'll fly away from the dangerous collision.
        if (isTooClose) {
          var dX = boid.position.x - otherBoid.position.x;
          var dY = boid.position.y - otherBoid.position.y;
          var sqrtSafeDist = Math.sqrt(_this.minSafeDistance);
          
          if (dX < 0) {
            dX = -sqrtSafeDist - dX;
          }
          else {
            dX = sqrtSafeDist - dX;
          }
          
          if (dY < 0) {
            dY = -sqrtSafeDist - dY;
          }
          else {
            dY = sqrtSafeDist - dY;
          }
          
          
          xAdjustment += dX;
          yAdjustment += dY;
        }
      }
    });
    
    // Finally, adjust this boid's velocity to avoid all
    // possible collisions.
    var soften = this.minSafeDistance / this.numBoids * 2.0;
    boid.xVelocity -= xAdjustment / soften;
    boid.yVelocity -= yAdjustment / soften;
  };



  // This function is called once per animation for each boid.
  // It keeps the boid within the bounds of the picture.
  this.keepBoidWithinBounds = function(boid) {
    // If this boid is outside the X coordinates of our image,
    // make it fly the other direction so it'll come back.
    if (boid.position.x > this.maxX) {
      boid.position.x = this.maxX;
      boid.xVelocity = -1 * boid.xVelocity;
    }
    if (boid.position.x < this.minX) {
      boid.position.x = this.minX;
      boid.xVelocity = -1 * boid.xVelocity;
    }
    
    // If this boid is outside the Y coordinates of our image,
    // make it fly the other direction so it'll come back.
    if (boid.position.y > this.maxY) {
      boid.position.y = this.maxY;
      boid.yVelocity = -1 * boid.yVelocity;
    }
    if (boid.position.y < this.minY) {
      boid.position.y = this.minY;
      boid.yVelocity = -1 * boid.yVelocity;
    }
    
  };

  // This function is called once per animation for each boid.
  // It makes sure the boid isn't going too fast.
  this.restrictVelocity = function(boid) {
    boid.xVelocity = Math.min(boid.xVelocity, this.maxVelocity);
    boid.yVelocity = Math.min(boid.yVelocity, this.maxVelocity);
  };

  // This function is called once per animation for each boid.
  // It runs all the simple rules that create flocking behavior
  // and adjusts the position of the boid for the next step of
  // the animation.
  this.positionBoid = function(boid) {
    // Simple rule #1: follow the flock's flight direction
    this.followFlock(boid);
    
    // Simple rule #2: aim into the center of the flock
    this.aimAtCenterOfFlock(boid);
    
    // Simple rule #3: avoid collision with other boids
    this.avoidOtherBoids(boid);
    
    
    // Make sure nobody is going to get a speeding ticket for
    // flying too fast
    this.restrictVelocity(boid);

    
    boid.position.x += boid.xVelocity;
    boid.position.y += boid.yVelocity;
    
    // Make sure all boids are flying within the image
    this.keepBoidWithinBounds(boid);
  };

  Phaser.Group.call(this, game);

  for(var i = 0; i < this.numBoids; i++){
        var boid = new Boid(game, 'ball', i, this.maxVelocity);
        this.add(boid);
  }

  
};

Boids.prototype = Object.create(Phaser.Group.prototype);
Boids.prototype.constructor = Boids;

Boids.prototype.update = function(){
  var _this = this;
  this.forEach(function(boid){
    _this.positionBoid(boid);
  })
};