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
    player = null;

    enter() {
      console.log("Entered play screen.");
      const map = [];
      const mapWidth = 250;
      const mapHeight = 250;
      for (let x = 0; x < mapWidth; x++) {
        // Create the nested array for the y values
        map.push([]);
        // Add all the tiles
        for (let y = 0; y < mapHeight; y++) {
          map[x].push(tiles.nullTile);
        }
      }
      const generator = new ROT.Map.Digger(mapWidth, mapHeight);
      generator.create(function(x,y,v) {
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
      const position = this.map.getRandomFloorPosition();
      this.player.setX(position.x);
      this.player.setY(position.y);
    };

    exit() { console.log("Exited play screen."); };

    render(display) { 
      const screenWidth = this.game.getScreenWidth();
      const screenHeight = this.game.getScreenHeight();
      let topLeftX = Math.max(0, this.player.getX() - (screenWidth / 2));
      topLeftX = Math.min(topLeftX, this.map.getWidth() - screenWidth);
      let topLeftY = Math.max(0, this.player.getY() - (screenHeight / 2));
      topLeftY = Math.min(topLeftY, this.map.getHeight() - screenHeight);

      const visibleCells = {};
      // Find all visible cells and update the object
      this.map.getFov(this.player.getZ()).compute(
          this.player.getX(), this.player.getY(), 
          this.player.getSightRadius(), 
          function(x, y, radius, visibility) {
              visibleCells[x + "," + y] = true;
          });
      // Iterate through all visible map cells
      for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
        for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
          if (visibleCells[x + ',' + y]) {
          // Fetch the glyph for the tile and render it to the screen
            const tile = this.map.getTile(x, y);
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
        this.player.getX() - topLeftX, 
        this.player.getY() - topLeftY,    
        this.player.getChar(), 
        this.player.getForeground(), 
        this.player.getBackground(),
      );
    };
    handleInput(inputType, inputData) { 
      if (inputType === 'keydown') {
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
      const newX = this.player.getX() + dX;
      const newY = this.player.getY() + dY;
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

