import { Game } from './game';
import './style.css';

const appContainer = document.querySelector('#app');

if (appContainer) main(appContainer);

function main(appContainer: Element) {
  const game = new Game(appContainer);
  game.start();
}
