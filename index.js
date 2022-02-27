import { Game } from './src/Game.js';
import { StartScreen } from './src/Screens.js';

let myGame = new Game();
myGame.init();
document.body.appendChild(myGame.getDisplay().getContainer());
myGame.switchScreen(new StartScreen(myGame));
