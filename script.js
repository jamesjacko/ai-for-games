/**
    ask function, 
    runs the function supplied based on the probabiliy supplied
    parameters to be used in the function are passed via an object
**/
var ask = function(options){
    if(Math.floor(Math.random() * options.prob) == 0)
        options.func(options.params);
}

/*
 * returns whether a supplied x or y are outside of the world.
 */
var areYouOutside = function(x, y, world){
  return (x < 0 || y < 0 || x > world.bounds.width - 1 || y > world.bounds.height - 1)
}



var RandPoint = function(varience) {
    varience = varience || 200;
    this.x = Math.round(Math.random() * varience) - varience/2,
    this.y = Math.round(Math.random() * varience) - varience/2
}

var RandPoint = function(x, y, varience) {
    this.x = x + Math.round(Math.random() * varience) - varience/2,
    this.y = y + Math.round(Math.random() * varience) - varience/2
}

