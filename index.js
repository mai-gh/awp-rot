import { Game } from './src/Game.js';
import { StartScreen } from './src/Screens.js';

const myGame = new Game();
myGame.init();
document.body.appendChild(myGame.getDisplay().getContainer());
myGame.switchScreen(new StartScreen(myGame));
