export class Glyph {
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
