/**
    ask function, 
    runs the function supplied based on the probabiliy supplied
    parameters to be used in the function are passed via an object
**/
function ask(options){
    if(Math.floor(Math.random() * options.prob) == 0)
        options.func(options.params);
}

function vect_magnitude(vector){
  vector.magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

function vect_normalize(vector){
  if(vector.magnitude){
    vector.normal = {
      x: vector.x * vector.magnitude,
      y: vector.y * vector.magnitude
    };
  }
}