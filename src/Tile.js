import {Glyph} from './Glyph.js';


export class Tile extends Glyph {
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

export const tiles = {
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
