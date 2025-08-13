import { createRandomInt } from './utils';
import {
  Validator,
  type TCell,
  type TLine,
  type TPosition,
  type TTable,
} from './validator';

type TElementsTableRow = HTMLSpanElement[];
type TElementsTable = TElementsTableRow[];

export class Game {
  private elementsTable: TElementsTable;
  private selectedCell: TPosition | null;
  private table: TTable;
  private easeLevel: number;

  constructor(private container: Element) {
    document.addEventListener('click', () => {
      this.resetSelectedCell();
    });

    this.elementsTable = [];
    this.table = [];
    this.selectedCell = null;
    this.easeLevel = 40;

    let isValuesCreated = false;

    while (!isValuesCreated) {
      isValuesCreated = this.createValues();
    }
  }

  private createValues(): boolean {
    this.table = [];

    // Generenate empty table
    for (let y = 0; y < 9; y++) {
      const line: TLine = [];
      for (let x = 0; x < 9; x++) {
        line.push({ value: null, isEditable: true });
      }
      this.table.push(line);
    }

    // Generate values
    const validator = new Validator(this.table);
    for (let y = 0; y < 9; y++) {
      let isLineGenerated = false;
      let lineGenerateTriesCount = 1;

      while (isLineGenerated === false) {
        const availableValues: number[] = [];

        while (availableValues.length < 9) {
          const value = createRandomInt(1, 9);
          if (!availableValues.includes(value)) availableValues.push(value);
        }

        let x = 0;
        let i = 0;
        let triesCount = 1;
        while (availableValues.length !== 0) {
          const value = availableValues[i];
          if (validator.check({ y, x }, value)) {
            this.getCell({ y, x }).value = value;
            availableValues.splice(i, 1);
            x++;
            i = 0;
            continue;
          }

          if (i >= availableValues.length - 1) i = 0;
          else i++;

          if (triesCount > 9) break;

          triesCount++;
        }

        if (availableValues.length === 0) isLineGenerated = true;
        else {
          for (let x = 0; x < 9; x++) {
            this.table[y][x] = { value: null, isEditable: true };
          }
        }

        if (lineGenerateTriesCount > 100) return false;

        lineGenerateTriesCount++;
      }
    }

    let easeLevelIncreament = 1;

    while (easeLevelIncreament <= this.easeLevel) {
      const y = createRandomInt(0, 8);
      const x = createRandomInt(0, 8);

      if (this.getCell({ y, x }).isEditable) {
        this.getCell({ y, x }).isEditable = false;
        easeLevelIncreament++;
      }
    }

    for (const line of this.table) {
      for (const cell of line) {
        if (cell.isEditable) cell.value = null;
      }
    }

    return true;
  }

  private resetSelectedCell() {
    if (this.selectedCell)
      this.elementsTable[this.selectedCell.y][
        this.selectedCell.x
      ].classList.remove('selected');

    this.selectedCell = null;
  }

  private getCell({ y, x }: TPosition): TCell {
    return this.table[y][x];
  }

  private getElement({ y, x }: TPosition): HTMLSpanElement {
    return this.elementsTable[y][x];
  }

  private handleSelectCell(x: number, y: number) {
    this.resetSelectedCell();
    if (!this.getCell({ x, y }).isEditable) return;

    this.selectedCell = { x, y };

    this.getElement({ x, y }).classList.add('selected');
  }

  public renderElements() {
    // Table
    const tableElement = document.createElement('div');
    tableElement.className = 'table';

    for (let y = 0; y < this.table.length; y++) {
      const row: TElementsTableRow = [];
      const lineElement = document.createElement('div');
      lineElement.classList = 'row';
      tableElement.appendChild(lineElement);

      for (let x = 0; x < this.table[y].length; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const span = document.createElement('span');
        span.addEventListener('click', (event) => {
          event.stopPropagation();
          this.handleSelectCell(x, y);
        });
        cell.appendChild(span);
        lineElement.appendChild(cell);
        row.push(span);
      }
      this.elementsTable.push(row);
    }

    this.container.appendChild(tableElement);

    // Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons';
    const numbersContainer = document.createElement('div');
    numbersContainer.className = 'numbers';

    for (let number = 1; number <= 9; number++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerText = number.toString();
      button.addEventListener('click', () => {
        this.setValue(number);
      });
      numbersContainer.appendChild(button);
    }

    buttonsContainer.appendChild(numbersContainer);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options';

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.innerText = 'Limpar';
    clearButton.addEventListener('click', () => {
      this.setValue(null);
    });

    optionsContainer.appendChild(clearButton);

    const restartButton = document.createElement('button');
    restartButton.type = 'button';
    restartButton.innerText = 'Reiniciar';
    restartButton.addEventListener('click', () => {
      this.restart();
    });

    optionsContainer.appendChild(restartButton);

    buttonsContainer.appendChild(optionsContainer);

    this.container.appendChild(buttonsContainer);
  }

  private setValue(value: number | null) {
    if (!this.selectedCell) return;
    if (!this.getCell(this.selectedCell).isEditable) return;
    const selectedCellPosition = this.selectedCell;

    const validator = new Validator(this.table);

    if (
      this.getCell(selectedCellPosition).value !== value &&
      value !== null &&
      !validator.check(selectedCellPosition, value)
    ) {
      this.getElement(selectedCellPosition).classList.add('invalidValue');
      this.getCell(selectedCellPosition).isEditable = false;
      setTimeout(() => {
        this.getElement(selectedCellPosition).classList.remove('invalidValue');
        this.getCell(selectedCellPosition).value = null;
        this.getCell(selectedCellPosition).isEditable = true;
        this.getElement(selectedCellPosition).innerText = '';
      }, 1500);
    }

    this.getCell(selectedCellPosition).value = value;
    this.getElement(selectedCellPosition).innerText = value?.toString() ?? '';
  }

  public renderValues() {
    this.table.forEach((line, y) => {
      line.forEach((cell, x) => {
        this.elementsTable[y][x].innerText = cell.value?.toString() ?? '';
        if (!cell.isEditable)
          this.elementsTable[y][x].classList.add('isNotEditable');
        else this.elementsTable[y][x].classList.remove('isNotEditable');
      });
    });
  }

  public restart() {
    let isValuesCreated = false;

    while (!isValuesCreated) {
      isValuesCreated = this.createValues();
    }

    this.renderValues();
  }

  public start() {
    this.renderElements();
    this.renderValues();
  }
}
