import * as ROT from "../lib/index.js";

export class Game {
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
    const game = this; // So that we don't lose this
    const bindEventToScreen = function(event) {
        window.addEventListener(event, function(e) {
            if (game.currentScreen !== null) {
                game.currentScreen.handleInput(event, e);
                game.display.clear();
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
    if (this.currentScreen !== null) {
        this.currentScreen.exit();
    }
    this.getDisplay().clear();
    this.currentScreen = screen;
    if (!this.currentScreen !== null) {
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
