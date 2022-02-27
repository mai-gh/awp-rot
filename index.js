import { Game } from './src/Game.js';
import { StartScreen } from './src/Screens.js';

const game = new Game();
game.init();
document.body.appendChild(game.getDisplay().getContainer());
game.switchScreen(new StartScreen(game));
