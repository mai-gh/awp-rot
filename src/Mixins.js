export class  MoveableMixin {
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

export  class SightMixin {
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
