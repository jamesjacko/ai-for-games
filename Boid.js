function Boid(position){
	var _this = this;
	this.location = Vector.create([
		position.x,
		posiiton.y
	]);
	var angle = Math.random() * 2 * Math.PI;
	this.velocity = Vector.create([
		Math.cos(angle),
		Math.sin(angle)
	]);
	this.acceleration = Vector.create();
	this.r = 2;
	this.maxSpeed = 2;
	this.maxForce = 0.03;

	this.run = function(boids){
		flock(boids);
		update();
		borders();
		render();
	}

	this.applyForce = function(force){
		_this.acceleration.add(force);
	}

	this.flock = function(boids){
		var sep = _this.separate(boids);
		var ali = _this.align(boids);
		var coh = _this.cohesion(boids);
		sep.multiply(1.5);
		ali.multiply(1.0);
		coh.multiply(1.0);
		_this.applyForce(sep);
		_this.applyForce(ali);
		_this.applyForce(coh);
	}

	this.update(){
		_this.velocity.add(acceleration);
		_this.velocity.limit(maxSpeed);
		_this.location.add(velocity);
		_this.acceleration.multiply(0);
	}

	this.seek = function(target){
		var desired = Vector.create
	}


}