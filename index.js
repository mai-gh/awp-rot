//import { Display, Map, Util } from "./lib/index.js";
import * as ROT from "./lib/index.js";
//import ROT from "./rot.js";

const Game = {
  display: null,
  currentScreen: null,
  screenWidth: 80,
  screenHeight: 24,
  map: {},
  engine: null,
  player: null,

/*
  init: function () {
    var map = new ROT.Map.Digger();
    var display = new ROT.Display({fontSize:18});
    //SHOW(display.getContainer());
    document.body.appendChild(display.getContainer());
    map.create(function(x, y, wall) {
      display.draw(x, y, wall ? "#" : ".");
    });
  }
*/



  // ------------------------------------------------------------------

  Glyph: function (properties) {

    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
    // Instantiate properties to default if they weren't passed
    //this.chr = chr || ' ';
    //this.foreground = foreground || 'white';
    //this.background = background || 'black';
  },


  // ------------------------------------------------------------------

  Entity: function(properties) {
    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
    
    // Call the glyph's construtor with our set of properties
    Game.Glyph.call(this, properties);
    // Instantiate any properties from the passed object
    this.name = properties['name'] || '';
    this.x = properties['x'] || 0;
    this.y = properties['y'] || 0;
   
    // Create an object which will keep track what mixins we have
    // attached to this entity based on the name property
    this.attachedMixins = {};
    // Setup the object's mixins
    var mixins = properties['mixins'] || [];
    for (var i = 0; i < mixins.length; i++) {
        // Copy over all properties from each mixin as long
        // as it's not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
        for (var key in mixins[i]) {
            if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
            }
        }
        // Add the name of this mixin to our attached mixins
        this.attachedMixins[mixins[i].name] = true;
        // Finally call the init function if there is one
        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
    }
  },

  // ------------------------------------------------------------------

  Mixins: {
    Moveable: {
      name: 'Moveable',
      tryMove: function(x, y, map) {
        var tile = map.getTile(x, y);
        // Check if we can walk on the tile
        // and if so simply walk onto it
        console.log('tile: ', tile)
        //if (tile.isWalkable()) {
        if (tile.isWalkable) {
          // Update the entity's position
          this.x = x;
          this.y = y;
          return true;
        // Check if the tile is diggable, and
        // if so try to dig it
        //} else if (tile.isDiggable()) {
        } /*else if (tile.isDiggable) {
          map.dig(x, y);
          return true;
        }*/
        return false;
      },
    },
  },

  // ------------------------------------------------------------------

  Tile: function (properties) {
    //this.glyph = glyph;
    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this.isWalkable = properties['isWalkable'] || false;
    this.isDiggable = properties['isDiggable'] || false;
  },

  Map: function(tiles) {
    this.tiles = tiles;
    // cache the width and height based
    // on the length of the dimensions of
    // the tiles array
    this.width = tiles.length;
    this.height = tiles[0].length;
  },



  // ------------------------------------------------------------------

  Screen: {
    startScreen: {
      enter: function () { console.log("Entered start screen."); },
      exit: function () { console.log("Exited start screen."); },
      render: function (display) { 
        display.drawText(20,4, "%c{yellow}Async Week Project - Rot.js");
        display.drawText(22,5, "Press [Enter] to start!");
        display.drawText(30,10,  "┌    ^    ┐ ");
        display.drawText(31,11, "\\   |   /  ");
        display.drawText(32,13,  "Y  K  U   ");

        display.drawText(29,15, "<- H  @  L ->");

        display.drawText(32,17, "   B  J  N ");
        display.drawText(31,19, "  /   |   \\");
        display.drawText(30,20, "└    V    ┘");
      },
      handleInput: function(inputType, inputData) { 
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
          //console.log(`inputData.keyCode: ${inputData.keyCode}`)
          //console.log(`String.fromCharCode(x): ${String.fromCharCode(inputData.keyCode)}`)
          //console.log(`ROT.VK_RETURN: ${ROT.KEYS.VK_RETURN}`)
          if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
            Game.switchScreen(Game.Screen.playScreen);
          }
        }
      },
    },

    playScreen: {
      map: null,
      //centerX: 0,
      //centerY: 0,
      player: null,
      enter: function () {
        console.log("Entered play screen.");

        var map = [];
        var mapWidth = 250;
        var mapHeight = 250;
        for (var x = 0; x < mapWidth; x++) {
          // Create the nested array for the y values
          map.push([]);
          // Add all the tiles
          for (var y = 0; y < mapHeight; y++) {
            map[x].push(Game.Tile.nullTile);
          }
        }


        var generator = new ROT.Map.Digger(mapWidth, mapHeight);
        //var generator = new ROT.Map.Cellular(mapWidth, mapHeight, {timeLimit: 5000});
        //var generator = new ROT.Map.Uniform(mapWidth, mapHeight, {timeLimit: 5000});
        //var generator = new ROT.Map.Rogue(mapWidth, mapHeight, {timeLimit: 5000});

        // Setup the map generator
//        var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
//        generator.randomize(0.5);
        var totalIterations = 3;
//        // Iteratively smoothen the map
        for (var i = 0; i < totalIterations - 1; i++) {
          generator.create();
        }
        // Smoothen it one last time and then update our map
        generator.create(function(x,y,v) {
          //if (v === 1) {
          if (v === 0) {
            map[x][y] = Game.Tile.floorTile;
          } else {
            map[x][y] = Game.Tile.wallTile;
          }
        });
        // Create our map from the tiles
        this.map = new Game.Map(map);

        // Create our player and set the position
        this.player = new Game.Entity(Game.PlayerTemplate);
        var position = this.map.getRandomFloorPosition();
        this.player.setX(position.x);
        this.player.setY(position.y);

        //var display = new ROT.Display({fontSize:18});
      //SHOW(display.getContainer());
      //document.body.appendChild(display.getContainer());
      //generator.create(function(x, y, wall) {
      //  display.draw(x, y, wall ? "#" : ".");
     // });


      },
      exit: function () { console.log("Exited play screen."); },
      render: function (display) { 
        //display.drawText(4, 6, "%c{red}%b{white}Press [Enter] to win, or [Esc] to lose!"); 
  
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        // Make sure the x-axis doesn't go to the left of the left bound
        //var topLeftX = Math.max(0, this.centerX - (screenWidth / 2));
        var topLeftX = Math.max(0, this.player.getX() - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this.map.getWidth() - screenWidth);
        // Make sure the y-axis doesn't above the top bound
        //var topLeftY = Math.max(0, this.centerY - (screenHeight / 2));
        var topLeftY = Math.max(0, this.player.getY() - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this.map.getHeight() - screenHeight);

        // Iterate through all map cells
//        for (var x = 0; x < this.map.getWidth(); x++) {
//          for (var y = 0; y < this.map.getHeight(); y++) {
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
          for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
            // Fetch the glyph for the tile and render it to the screen
            //var glyph = this.map.getTile(x, y).getGlyph();
            var tile = this.map.getTile(x, y);
//            display.draw(x, y,
            display.draw(
              x - topLeftX, 
              y - topLeftY,
              tile.getChar(), 
              tile.getForeground(), 
              tile.getBackground());
          }
        }
        display.draw(
          //this.centerX - topLeftX, 
          //this.centerY - topLeftY,
          //'@',
          //'white',
          //'black'
          this.player.getX() - topLeftX, 
          this.player.getY() - topLeftY,    
          this.player.getChar(), 
          this.player.getForeground(), 
          this.player.getBackground(),
        );
      },
      handleInput: function(inputType, inputData) { 
        if (inputType === 'keydown') {
          // If enter is pressed, go to the win screen
          // If escape is pressed, go to lose screen
          if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
            Game.switchScreen(Game.Screen.winScreen);
          } else if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
          }
          // Movement
          if ((inputData.keyCode === ROT.KEYS.VK_LEFT) || (inputData.keyCode === ROT.KEYS.VK_H)) {
            this.move(-1, 0);
          } else if ((inputData.keyCode === ROT.KEYS.VK_RIGHT) || (inputData.keyCode === ROT.KEYS.VK_L)) {
            this.move(1, 0);
          } else if ((inputData.keyCode === ROT.KEYS.VK_UP) || (inputData.keyCode === ROT.KEYS.VK_K)) {
            this.move(0, -1);
          } else if ((inputData.keyCode === ROT.KEYS.VK_DOWN) || (inputData.keyCode === ROT.KEYS.VK_J)) {
            this.move(0, 1);
          } else if (inputData.keyCode === ROT.KEYS.VK_Y) { // LEFT-UP
            this.move(-1, -1);
          } else if (inputData.keyCode === ROT.KEYS.VK_U) { // RIGHT-UP
            this.move(1, -1);
          } else if (inputData.keyCode === ROT.KEYS.VK_B) { // LEFT-DOWN
            this.move(-1, 1);
          } else if (inputData.keyCode === ROT.KEYS.VK_N) { // RIGHT-DOWN
            this.move(1, 1);
          }
        }
      },
      move: function(dX, dY) {
/*
        // Positive dX means movement right
        // negative means movement left
        // 0 means none
        this.centerX = Math.max(0,
          Math.min(this.map.getWidth() - 1, this.centerX + dX));
        // Positive dY means movement down
        // negative means movement up
        // 0 means none
        this.centerY = Math.max(0,
          Math.min(this.map.getHeight() - 1, this.centerY + dY));
*/
        var newX = this.player.getX() + dX;
        var newY = this.player.getY() + dY;
        // Try to move to the new cell
        this.player.tryMove(newX, newY, this.map);
      },
    },

    winScreen: {
      enter: function () { console.log("Entered win screen."); },
      exit: function () { console.log("Exited win screen."); },
      render: function (display) { display.drawText(2, 1, "%b{green}You win! :)"); },
      handleInput: function(inputType, inputData) { },
    },

    loseScreen: {
      enter: function () { console.log("Entered lose screen."); },
      exit: function () { console.log("Exited lose screen."); },
      render: function (display) { display.drawText(2, 1, "%b{red}You lose! :("); },
      handleInput: function(inputType, inputData) { },
    },
  },

  // ------------------------------------------------------------------

  init: function () {
    this.display = new ROT.Display({width: this.screenWidth, height: this.screenHeight, fontSize: 18});
    var game = this; // So that we don't lose this
    var bindEventToScreen = function(event) {
        window.addEventListener(event, function(e) {
            // When an event is received, send it to the
            // screen if there is one
            if (game.currentScreen !== null) {
                // Send the event type and data to the screen
                game.currentScreen.handleInput(event, e);
                // Clear the screen
                game.display.clear();
                // Render the screen
                game.currentScreen.render(game.display);
            }
        });
    }
    // Bind keyboard input events
    bindEventToScreen('keydown');
    //bindEventToScreen('keyup');
    //bindEventToScreen('keypress');
  },

  getDisplay: function () {
    return this.display;
  },

  switchScreen: function(screen) {
    // If we had a screen before, notify it that we exited
    if (this.currentScreen !== null) {
        this.currentScreen.exit();
    }
    // Clear the display
    this.getDisplay().clear();
    // Update our current screen, notify it we entered
    // and then render it
    this.currentScreen = screen;
    if (!this.currentScreen !== null) {
        this.currentScreen.enter();
        this.currentScreen.render(this.display);
    }

  },

  getDisplay: function() {
    return this.display;
  },
  getScreenWidth: function() {
    return this.screenWidth;
  },
  getScreenHeight: function() {
    return this.screenHeight;
  },
}

// ------------------------------------------------------------------

// ECMA-SCRIPT 5 global access to prototype chain
// TODO: how to define inside Game??

Game.Glyph.prototype.getChar = function(){ 
  return this.chr; 
};

Game.Glyph.prototype.getBackground = function(){
  return this.background;
};

Game.Glyph.prototype.getForeground = function(){ 
  return this.foreground; 
};

// --------

//Game.Tile.extend(Game.Glyph);
Game.Tile.prototype.isWalkable = function() {
    return this.isWalkable;
}
Game.Tile.prototype.isDiggable = function() {
    return this.isDiggable;
}

Game.Tile.prototype.getGlyph = function() {
    return this.glyph;
};
//Game.Tile.nullTile = new Game.Tile(new Game.Glyph());
//Game.Tile.floorTile = new Game.Tile(new Game.Glyph('.'));
//Game.Tile.wallTile = new Game.Tile(new Game.Glyph('#', 'goldenrod'));
Game.Tile.nullTile = new Game.Tile({})
Game.Tile.floorTile = new Game.Tile({
    character: '.',
    isWalkable: true
});
Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'goldenrod',
    isDiggable: true
});

Game.Tile.prototype.getChar = function(){ 
  return this.chr; 
};

Game.Tile.prototype.getBackground = function(){
  return this.background;
};

Game.Tile.prototype.getForeground = function(){ 
  return this.foreground; 
};

// Make entities inherit all the functionality from glyphs
//Game.Entity.extend(Game.Glyph);

Game.Entity.prototype.setName = function(name) {
    this.name = name;
}
Game.Entity.prototype.setX = function(x) {
    this.x = x;
}
Game.Entity.prototype.setY = function(y) {
    this.y = y;
}
Game.Entity.prototype.getName = function() {
    return this.name;
}
Game.Entity.prototype.getX = function() {
    return this.x;
}
Game.Entity.prototype.getY   = function() {
    return this.y;
}

Game.Entity.prototype.hasMixin = function(obj) {
    // Allow passing the mixin itself or the name as a string
    if (typeof obj === 'object') {
        return this.attachedMixins[obj.name];
    } else {
        return this.attachedMixins[name];
    }
}

Game.Entity.prototype.getChar = function(){ 
  return this.chr; 
};

Game.Entity.prototype.getBackground = function(){
  return this.background;
};

Game.Entity.prototype.getForeground = function(){ 
  return this.foreground; 
};


Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    mixins: [Game.Mixins.Moveable]
}


// --------

Game.Map.prototype.getWidth = function() {
    return this.width;
};
Game.Map.prototype.getHeight = function() {
    return this.height;
};

// Gets the tile for a given coordinate set
Game.Map.prototype.getTile = function(x, y) {
    // Make sure we are inside the bounds. If we aren't, return
    // null tile.
    //console.log('this: ', this, 'x: ', x, 'y: ', y)
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return Game.Tile.nullTile;
    } else {
        return this.tiles[x][y] || Game.Tile.nullTile;
    }
};

Game.Map.prototype.dig = function(x, y) {
    // If the tile is diggable, update it to a floor
    if (this.getTile(x, y).isDiggable()) {
        this.tiles[x][y] = Game.Tile.floorTile;
    }
}

Game.Map.prototype.getRandomFloorPosition = function() {
    // Randomly generate a tile which is a floor
    var x, y;
    do {
        x = Math.floor(Math.random() * this.width);
        // TODO: double check this should be this.width for y ??
        y = Math.floor(Math.random() * this.width);
    } while(this.getTile(x, y) != Game.Tile.floorTile);
    return {x: x, y: y};
}


// ------------------------------------------------------------------
  


Game.init();
document.body.appendChild(Game.getDisplay().getContainer());
Game.switchScreen(Game.Screen.startScreen);





























//const monsters = {
//    "orc": 3,
//    "ogre": 1,
//    "rat": 5
//}


//let o = {
//	width: 80,
//	height: 25
//}
//let d = new Display(o);
////////////////////////////////document.body.appendChild(d.getContainer());

//for (let i=0; i<o.width; i++) {
//	for (let j=0; j<o.height; j++) {
//		if (!i || !j || i+1 == o.width || j+1 == o.height) {
//			d.draw(i, j, "#", "gray");
//		} else {
//			d.draw(i, j, ".", "#666");
//		}
//	}
//}
//d.draw(o.width >> 1, o.height >> 1, "@", "goldenrod");


/*
const map = new ROT.Map.Arena(10, 5);

const display1 = new ROT.Display({width:10, height:5, fontSize:18});
//display1.getContainer();
document.body.appendChild(display1.getContainer());


map.create(function(x, y, wall) {
    display1.draw(x, y, wall ? "#" : ".");
});
*/

/* debugging with small font */
//var display2 = new ROT.Display({width:10, height:5, fontSize:8});
//SHOW(display2.getContainer());
//map.create(display2.DEBUG);



/*
//ROT.RNG.setSeed(1234);
var map = new ROT.Map.Digger();
var display = new ROT.Display({fontSize:18});
//SHOW(display.getContainer());
document.body.appendChild(display.getContainer());
//map.create(display.DEBUG);
map.create(function(x, y, wall) {
    display.draw(x, y, wall ? "#" : ".");
});
*/



//var drawDoor = function(x, y) {
//    display.draw(x, y, "", "", "red");
//}

/*
var rooms = map.getRooms();
for (var i=0; i<rooms.length; i++) {
    var room = rooms[i];
    //SHOW(ROT.Util.format("Room #%s: [%s, %s] => [%s, %s]",
    ROT.Util.format("Room #%s: [%s, %s] => [%s, %s]",
        (i+1),
        room.getLeft(), room.getTop(),
        room.getRight(), room.getBottom()
    );

    //room.getDoors(drawDoor);
}
*/
