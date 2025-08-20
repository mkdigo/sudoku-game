import type { TPosition, TTable } from '../validator';
import { Button } from './button';
import { Div } from './div';
import { Modal } from './modal';
import { Sudoku, type TSudokuTable } from './sudoku';

import './style.css';

type Props = {
  container: Element;
  table: TTable;
  restart: () => void;
  setValue: (value: number | null) => void;
  onSelectCell: (position: TPosition) => void;
};

export class Render {
  private container: Element;
  private table: TTable;
  private restart: () => void;
  private setValue: (value: number | null) => void;
  private onSelectCell: (position: TPosition) => void;
  private sudokuTable: TSudokuTable;
  private winModal?: Modal;

  constructor({ container, table, restart, setValue, onSelectCell }: Props) {
    this.container = container;
    this.table = table;
    this.restart = restart;
    this.setValue = setValue;
    this.onSelectCell = onSelectCell;
    this.sudokuTable = [];
  }

  private getSudokuCell({ y, x }: TPosition): HTMLSpanElement {
    return this.sudokuTable[y][x];
  }

  public setTable(table: TTable) {
    this.table = table;
  }

  public selectCell(position: TPosition) {
    this.getSudokuCell(position).classList.add('selected');
  }

  public unselectCell(position: TPosition) {
    this.getSudokuCell(position).classList.remove('selected');
  }

  public makeCellInvalid(position: TPosition) {
    this.getSudokuCell(position).classList.add('invalidValue');
  }

  public makeCellValid(position: TPosition) {
    this.getSudokuCell(position).classList.remove('invalidValue');
  }

  public writeValue(position: TPosition, value: string) {
    this.getSudokuCell(position).innerText = value;
  }

  public writeAllValues(table?: TTable) {
    if (table) this.setTable(table);

    this.table.forEach((line, y) => {
      line.forEach((cell, x) => {
        this.getSudokuCell({ x, y }).innerText = cell.value?.toString() ?? '';
        if (!cell.isEditable)
          this.getSudokuCell({ x, y }).classList.add('isNotEditable');
        else this.getSudokuCell({ x, y }).classList.remove('isNotEditable');
      });
    });
  }

  public destroy() {
    this.container.innerHTML = '';
  }

  public win() {
    this.winModal?.open();
  }

  public execute() {
    // Modals
    const restartModal = new Modal({
      modalId: 'restart-modal',
      title: 'Reiniciar Jogo',
      text: 'Tem certeza que deseja começar um novo jogo?',
      onConfirm: () => {
        this.restart();
      },
    });

    restartModal.render(this.container);

    const winModal = new Modal({
      modalId: 'win-modal',
      title: 'Parabens, você conseguiu!!!',
      text: 'Deseja começar um novo jogo?',
      onConfirm: () => {
        this.restart();
      },
    });
    this.winModal = winModal;

    winModal.render(this.container);

    // Sudoku Table
    const sudoku = new Sudoku();
    this.sudokuTable = sudoku.create(this.table, this.onSelectCell);
    sudoku.render(this.container);

    // Buttons
    const buttonsContainer = new Div({ className: 'buttons' });
    const numbersContainer = new Div({ className: 'numbers' });

    for (let number = 1; number <= 9; number++) {
      const button = new Button();
      button.innerText(number.toString());
      button.get().addEventListener('click', () => {
        this.setValue(number);
      });
      button.render(numbersContainer);
    }

    numbersContainer.render(buttonsContainer);

    const optionsContainer = new Div({ className: 'options' });

    const clearButton = new Button();
    clearButton.innerText('Limpar');
    clearButton.get().addEventListener('click', () => {
      this.setValue(null);
    });

    clearButton.render(optionsContainer);

    const restartButton = new Button();
    restartButton.innerText('Reiniciar');
    restartButton.get().addEventListener('click', () => {
      restartModal.open();
    });

    restartButton.render(optionsContainer);

    optionsContainer.render(buttonsContainer);
    buttonsContainer.render(this.container);

    this.writeAllValues();
  }
}
