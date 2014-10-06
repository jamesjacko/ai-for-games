/**
    ask function, 
    runs the function supplied based on the probabiliy supplied
    parameters to be used in the function are passed via an object
**/
function ask(options){
    if(Math.floor(Math.random() * options.prob) == 0)
        options.func(options.params);
}