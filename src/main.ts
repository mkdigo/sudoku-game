import { Game } from './game';

const appContainer = document.querySelector('#app');

if (appContainer) main(appContainer);

function main(appContainer: Element) {
  const game = new Game(appContainer);
  game.start();
}
