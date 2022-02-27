import * as ROT from "../lib/index.js";
import { tiles } from './Tile.js';

export class Map {
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
    let x, y;
    do {
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);
    } while(this.getTile(x, y) != tiles.floorTile);
    return {x: x, y: y};
  };

  setupFov() {
    // Keep this in 'map' variable so that we don't lose it.
    const map = this;
    this.depth = 1;
    // Iterate through each depth level, setting up the field of vision
    for (let z = 0; z < this.depth; z++) {
        // We have to put the following code in it's own scope to prevent the
        // depth variable from being hoisted out of the loop.
        (function() {
            // For each depth, we need to create a callback which figures out
            // if light can pass through a given tile.
            let depth = z;
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
