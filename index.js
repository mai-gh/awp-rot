import * as ROT from "./lib/index.js";


// ------------------------------------------------------------------

class Game {
  constructor() {
    this.display = null;
    this.currentScreen = null;
    this.screenWidth = 80;
    this.screenHeight = 24;
    this.map = {};
    this.engine = null;
    this.player = null;
  }

  init() {
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
  };

  getDisplay() {
    return this.display;
  };

  switchScreen(screen) {
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
        console.log(this);
        this.currentScreen.enter();
        this.currentScreen.render(this.display);
    }
  };

  getDisplay() {
    return this.display;
  };

  getScreenWidth() {
    return this.screenWidth;
  };
  getScreenHeight() {
    return this.screenHeight;
  };

};

// ------------------------------------------------------------------

class Glyph { 
  constructor(properties) {
    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
  };

  getChar() { 
    return this.chr; 
  };
  
  getBackground() {
    return this.background;
  };
  
  getForeground() { 
    return this.foreground; 
  };
};

// ------------------------------------------------------------------

class Entity extends Glyph{ 
  constructor(properties) {
    super();
    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
    
    // Call the glyph's construtor with our set of properties
//    Game.Glyph.call(this, properties);
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
//        Object.getOwnPropertyNames(mixins[i].prototype).forEach((value) => {
//          console.log('qqq i: ', i, 'value: ', value);
//        })
        let sss = Object.getPrototypeOf(mixins[i])
        let sss2 = Object.getOwnPropertyNames(sss)
        let ttt = Object.getOwnPropertyNames(mixins[i])
        let xxx = mixins[i]
        let www = ttt.concat(sss2)
        console.log('sss', Object.getPrototypeOf(mixins[i]))
        console.log('ttt', Object.getOwnPropertyNames(mixins[i]))
        //console.log('www', Object.getOwnPropertyNames(mixins[i]).concat(Object.getPrototypeOf(mixins[i])));
        console.log('xxx', xxx)
        console.log('www', www);
        let jjj = {...xxx}
        for (let g of sss2) {
          console.log('g', g)
          console.log('sss[g]', sss[g])
          let h = sss[g]
          jjj = {...jjj, [g]: h}
        }
         
        //Object.assign(jjj, xxx, sss);
        


        console.log('jjj', jjj)
        let rrr = []
        if (mixins[i].prototype) {
          rrr = Object.getOwnPropertyNames(mixins[i].prototype)
        }
        console.log('rrr', rrr)

        // for data
        //for (var key in mixins[i]) {
        for (var key in jjj) {
            console.log('ooo', 'key', key, 'i', i, 'this', this);
            if (key != 'init' && key != 'name' && key != 'constructor' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
                console.log('ppp', 'key', key, 'i', i, 'this', this);
            }
        }


        console.dir(this, {depth:null})
/*
        // for methods
        for (var key in Object.getPrototypeOf(mixins[i])) {
            console.log('ooo2', 'key', key, 'i', i, 'this', this);
            if (key != 'init' && key != 'name' && key != 'constructor' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
                console.log('ppp2', 'key', key, 'i', i, 'this', this);
            }
        

        }
*/

        // Add the name of this mixin to our attached mixins
        this.attachedMixins[mixins[i].name] = true;
        // Finally call the init function if there is one
        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
    }
    console.log('iii', properties)
  };
  // Make entities inherit all the functionality from glyphs
  //Game.Entity.extend(Game.Glyph);
  
  setName(name) {
      this.name = name;
  }
  setX(x) {
      this.x = x;
  }
  setY(y) {
      this.y = y;
  }
  setZ(z) {
      this.z = z;
  }
  getName() {
      return this.name;
  }
  getX() {
      return this.x;
  }
  getY  () {
      return this.y;
  }
  
  getZ() {
      //return this.z;
      return 0;
  }

  hasMixin(obj) {
    // Allow passing the mixin itself or the name as a string
    console.log('hasMixin(obj)', obj)
    if (typeof obj === 'object') {
        return this.attachedMixins[obj.name];
    } else {
        return this.attachedMixins[name];
    }
  }

/*
Game.Entity.prototype.getChar = function(){ 
  return this.chr; 
};

Game.Entity.prototype.getBackground = function(){
  return this.background;
};

Game.Entity.prototype.getForeground = function(){ 
  return this.foreground; 
};
*/
};

// ------------------------------------------------------------------

//class Mixins {
class  MoveableMixin {
//    constructor() {
//    this.name = 'Moveable';
//    }
    name = 'Moveable';
    tryMove(x, y, map) {
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
    };
  };

  class SightMixin {
//    constructor() {
//      this.name = 'Sight';
//      this.groupName = 'Sight';
//    };
    name = 'Sight';
    groupName = 'Sight';

    init(template) {
      this.sightRadius = template['sightRadius'] || 5;
    };
    getSightRadius() {
      return this.sightRadius;
    };
  };
//};

// ------------------------------------------------------------------

class Tile extends Glyph { 
  constructor(properties) {
   super();
   //this.glyph = glyph;
    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
    // Call the Glyph constructor with our properties
//    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this.isWalkable = properties['isWalkable'] || false;
    this.isDiggable = properties['isDiggable'] || false;
    this.blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
  };

  //Game.Tile.extend(Game.Glyph);
  isWalkable() {
    return this.isWalkable;
  };

  isBlockingLight = function() {
    return this.blocksLight;
  };

/*
  isDiggable = function() {
      return this.isDiggable;
  }
*/  

  getGlyph() {
      return this.glyph;
  };
};

const tiles = {
  nullTile: new Tile({}),

  floorTile: new Tile({
    character: '.',
    isWalkable: true,
    blocksLight: false
  }),

  wallTile: new Tile({
    character: '#',
    foreground: 'goldenrod',
  //    isDiggable: true
    blocksLight: true
  }),

  stairsUpTile: new Tile({
    character: '<',
    foreground: 'white',
    walkable: true,
    blocksLight: false
  }),
  stairsDownTile: new Tile({
    character: '>',
    foreground: 'white',
    walkable: true,
    blocksLight: false
  }),
}  
/*
  Game.Tile.prototype.getChar = function(){ 
    return this.chr; 
  };
  
  Game.Tile.prototype.getBackground = function(){
    return this.background;
  };
  
  Game.Tile.prototype.getForeground = function(){ 
    return this.foreground; 
  };
*/  


// ------------------------------------------------------------------

class Map {
  constructor(tiles) {
    this.tiles = tiles;
    // cache the width and height based
    // on the length of the dimensions of
    // the tiles array

    // setup the field of visions
    this.fov = [];
    this.setupFov();

    this.width = tiles.length;
    this.height = tiles[0].length;
  };

  getWidth() {
    return this.width;
  };

  getHeight() {
    return this.height;
  };

// Gets the tile for a given coordinate set
  getTile(x, y) {
    // Make sure we are inside the bounds. If we aren't, return
    // null tile.
    //console.log('this: ', this, 'x: ', x, 'y: ', y)
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return Game.Tile.nullTile;
    } else {
        return this.tiles[x][y] || Game.Tile.nullTile;
    }
  };

/*
  dig(x, y) {
    // If the tile is diggable, update it to a floor
    if (this.getTile(x, y).isDiggable()) {
        this.tiles[x][y] = Game.Tile.floorTile;
    }
  }
*/

  getRandomFloorPosition() {
    // Randomly generate a tile which is a floor
    var x, y;
    do {
        x = Math.floor(Math.random() * this.width);
        // TODO: double check this should be this.width for y ??
        //y = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);
    } while(this.getTile(x, y) != tiles.floorTile);
    return {x: x, y: y};
  };

  setupFov() {
    // Keep this in 'map' variable so that we don't lose it.
    var map = this;
    this.depth = 1;
    // Iterate through each depth level, setting up the field of vision
    for (var z = 0; z < this.depth; z++) {
        // We have to put the following code in it's own scope to prevent the
        // depth variable from being hoisted out of the loop.
        (function() {
            // For each depth, we need to create a callback which figures out
            // if light can pass through a given tile.
            var depth = z;
            map.fov.push(
                new ROT.FOV.DiscreteShadowcasting(function(x, y) {
                    return !map.getTile(x, y, depth).isBlockingLight();
                }, {topology: 4}));
        })();
    }
  };

  getFov = function(depth) {
    return this.fov[depth];
  };

};

// ------------------------------------------------------------------

class Screen {
//  constructor(game) {
//    this.game = game
//  }
}

class startScreen {
  constructor(game) {
    this.game = game
  }
  enter() { console.log("Entered start screen."); };
  exit() { console.log("Exited start screen."); };
  render(display) {
    display.drawText(20,1, "%c{yellow}Async Week Project - Rot.js");
    display.drawText(22,4, "Press [Enter] to start!");
    display.drawText(31,8,  "Controls:");
    display.drawText(30,10,  "┌    ^    ┐ ");
    display.drawText(31,11, "\\   |   /  ");
    display.drawText(32,13,  "Y  K  U   ");

    display.drawText(29,15, "<- H  @  L ->");

    display.drawText(32,17, "   B  J  N ");
    display.drawText(31,19, "  /   |   \\");
    display.drawText(30,20, "└    V    ┘");
    display.drawText(24,22, "(or use the arrow keys)");
  };
  handleInput(inputType, inputData) { 
    // When [Enter] is pressed, go to the play screen
    if (inputType === 'keydown') {
      //console.log(`inputData.keyCode: ${inputData.keyCode}`)
      //console.log(`String.fromCharCode(x): ${String.fromCharCode(inputData.keyCode)}`)
      //console.log(`ROT.VK_RETURN: ${ROT.KEYS.VK_RETURN}`)
      if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
        //this.display.clear();
        //this.display.drawText(16,13,  "L O A D I N G . . .");
        console.log('zzz', this.game)
        console.log('bbbbb', this)
        //myGame.switchScreen(myScreen.playScreen);
        this.game.switchScreen(new playScreen(this.game));
      };
    };
  };
};

class playScreen {
    constructor(game) {
       this.game = game;
    };
    map = null;
    //centerX: 0,
    //centerY: 0,
    player = null;
    enter() {
      console.log("Entered play screen.");
      var map = [];
      var mapWidth = 250;
      var mapHeight = 250;
      for (var x = 0; x < mapWidth; x++) {
        // Create the nested array for the y values
        map.push([]);
        // Add all the tiles
        for (var y = 0; y < mapHeight; y++) {
          map[x].push(tiles.nullTile);
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
          map[x][y] = tiles.floorTile;
        } else {
          map[x][y] = tiles.wallTile;
        }
      });
      // Create our map from the tiles
      this.map = new Map(map);

      // Create our player and set the position
      this.player = new Entity(playerTemplate);
      var position = this.map.getRandomFloorPosition();
      this.player.setX(position.x);
      this.player.setY(position.y);

      //var display = new ROT.Display({fontSize:18});
    //SHOW(display.getContainer());
    //document.body.appendChild(display.getContainer());
    //generator.create(function(x, y, wall) {
    //  display.draw(x, y, wall ? "#" : ".");
   // });


    };
    exit() { console.log("Exited play screen."); };
    render(display) { 
      //display.drawText(4, 6, "%c{red}%b{white}Press [Enter] to win, or [Esc] to lose!"); 

      var screenWidth = this.game.getScreenWidth();
      var screenHeight = this.game.getScreenHeight();
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
      var visibleCells = {};
      // Find all visible cells and update the object
      this.map.getFov(this.player.getZ()).compute(
          this.player.getX(), this.player.getY(), 
        //  console.log('uuuu this.player', this.player),
          this.player.getSightRadius(), 
          function(x, y, radius, visibility) {
              visibleCells[x + "," + y] = true;
          });
      // Iterate through all visible map cells
//        for (var x = 0; x < this.map.getWidth(); x++) {
//          for (var y = 0; y < this.map.getHeight(); y++) {
      for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
        for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
          if (visibleCells[x + ',' + y]) {
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
    };
    handleInput(inputType, inputData) { 
      if (inputType === 'keydown') {
        // If enter is pressed, go to the win screen
        // If escape is pressed, go to lose screen

/*          if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
          Game.switchScreen(Game.Screen.winScreen);
        } else if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
              Game.switchScreen(Game.Screen.loseScreen);
        }
*/
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
    };
    move(dX, dY) {
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
    };
  };

  class winScreen extends Screen {
    enter() { console.log("Entered win screen."); };
    exit() { console.log("Exited win screen."); };
    render(display) { display.drawText(2, 1, "%b{green}You win! :)"); };
    handleInput(inputType, inputData) { };
  };

  class loseScreen extends Screen {
    enter() { console.log("Entered lose screen."); };
    exit() { console.log("Exited lose screen."); };
    render(display) { display.drawText(2, 1, "%b{red}You lose! :("); };
    handleInput(inputType, inputData) { };
  };


// ------------------------------------------------------------------

const playerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    maxHp: 40,
    attackValue: 10,
    sightRadius: 6,
    //mixins: [Game.Mixins.Moveable,  Game.Mixins.Sight],
    //mixins: [Mixins.Moveable,  Mixins.Sight],
    mixins: [new MoveableMixin(),  new SightMixin()],
};


let myGame = new Game();
//console.dir(myGame, {depth:null});
//let myScreen = new Screen(myGame);
//let myStartScreen = new startScreen(myGame)
 
myGame.init();
document.body.appendChild(myGame.getDisplay().getContainer());
myGame.switchScreen(new startScreen(myGame));
//myGame.switchScreen(myScreen.startScreen);
//myGame.switchScreen(myScreen.playScreen);

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
