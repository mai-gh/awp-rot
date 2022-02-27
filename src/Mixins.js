export class MoveableMixin {
  name = "Moveable";
  tryMove(x, y, map) {
    const tile = map.getTile(x, y);
    if (tile.isWalkable) {
      // Update the entity's position
      this.x = x;
      this.y = y;
      return true;
    }
    return false;
  }
}

export class SightMixin {
  name = "Sight";
  groupName = "Sight";
  init(template) {
    this.sightRadius = template["sightRadius"] || 5;
  }
  getSightRadius() {
    return this.sightRadius;
  }
}
