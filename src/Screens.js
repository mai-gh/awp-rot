import * as ROT from "../lib/index.js";
import { tiles } from './Tile.js';
import { Entity } from './Entity.js';
import { playerTemplate } from './Templates.js';
import { Map } from './Map.js';

export class StartScreen {
  constructor(game) {
    this.game = game
//    this.display = this.game.getDisplay()
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
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
//        this.game.getDisplay().clear();
//        this.game.getDisplay().drawText(16,13,  "L O A D I N G . . .");
//        console.log('zzz', this.game)
//        console.log('bbbbb', this)
        //myGame.switchScreen(myScreen.playScreen);
        this.game.switchScreen(new PlayScreen(this.game));
      };
    };
  };
};

export class PlayScreen {
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

