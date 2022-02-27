import {Glyph} from './Glyph.js';


export class Tile extends Glyph {
  constructor(properties) {
   super();
    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
    this.isWalkable = properties['isWalkable'] || false;
    //this.isDiggable = properties['isDiggable'] || false;
    this.blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
  };

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
