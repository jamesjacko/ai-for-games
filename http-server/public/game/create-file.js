function createJSON(worldWidth, worldHeight){
    world = { 
        "height":worldHeight,
        "layers":[
            {
             "data": [],
             "height":worldHeight,
             "name":"Ground",
             "opacity":1,
             "type":"tilelayer",
             "visible":true,
             "width":worldWidth,
             "x":0,
             "y":0
            }],
        "orientation":"orthogonal",
        "properties":
        {

        },
        "tileheight":32,
        "tilesets":[
            {
             "firstgid":1,
             "image":"images/map.png",
             "imageheight":199,
             "imagewidth":265,
             "margin":1,
             "name":"Desert",
             "properties":
                {

                },
             "spacing":1,
             "tileheight":32,
             "tilewidth":32
            }],
        "tilewidth":32,
        "version":1,
        "width":worldWidth
    }


    world.data = Array();

    function isEdge(i){
        return i < world.width || 
        i > world.width * world.height - world.width || 
        i % world.width == 0 || 
        i % world.width == world.width - 1
    }



    for(i = 0; i < world.width * world.height; i++){
        if(isEdge(i)){
            // world.layers[0].data.push(Math.round(Math.random()*47) + 1);
            world.layers[0].data.push(1);
        } else {
            world.layers[0].data.push(3);
        }
    }

    for(i = 0; i < world.width * world.height; i++){
        if(world.layers[0].data[i] == 1){
            ask({prop:2, func:sea, params:i});
        }
    }

    function sea(i){
        console.log("I'm not working");
        if(world.layers[0].data[i - 1] == 3){
            world.layers[0].data[i - 1] = ask({prob:2, func:makeSea, params:null});
        }
        if(world.layers[0].data[i + 1] == 3){
            world.layers[0].data[i + 1] = ask({prob:2, func:makeSea, params:null});
        }
        for(j = -1; j < 2; j++){
            if(world.layers[0].data[i - world.width + j] == 3){
                world.layers[0].data[i - world.width + j] = ask({prob:2, func:makeSea, params:null});
            }
            if( world.layers[0].data[i + world.width + j] == 3){
                world.layers[0].data[i + world.width + j] = ask({prob:2, func:makeSea, params:null});
            }
        }
        
    }

    function makeSea(){
        return 1;
    }

    var json = JSON.stringify(world);
    console.log(world);
    var blob = new Blob([json], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    
    return url;
}