import { Render } from './render';
import { createRandomInt } from './utils';
import {
  Validator,
  type TCell,
  type TLine,
  type TPosition,
  type TTable,
} from './validator';

export class Game {
  private selectedCell: TPosition | null;
  private table: TTable;
  private easeLevel: number;
  private render: Render;

  constructor(private container: Element) {
    document.addEventListener('click', () => {
      this.resetSelectedCell();
    });

    this.table = [];
    this.selectedCell = null;
    // this.easeLevel = 40;
    this.easeLevel = 79;

    let isValuesCreated = false;

    while (!isValuesCreated) {
      isValuesCreated = this.createValues();
    }

    this.render = new Render({
      container: this.container,
      restart: this.restart.bind(this),
      onSelectCell: this.handleSelectCell.bind(this),
      setValue: this.setValue.bind(this),
      table: this.table,
    });
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
    if (this.selectedCell) this.render.unselectCell(this.selectedCell);

    this.selectedCell = null;
  }

  private getCell({ y, x }: TPosition): TCell {
    return this.table[y][x];
  }

  private handleSelectCell(position: TPosition) {
    this.resetSelectedCell();
    if (!this.getCell(position).isEditable) return;

    this.selectedCell = position;
    this.render.selectCell(position);
  }

  private setValue(value: number | null) {
    if (!this.selectedCell) return;
    if (!this.getCell(this.selectedCell).isEditable) return;
    const selectedCellPosition = this.selectedCell;

    this.render.writeValue(selectedCellPosition, value?.toString() ?? '');

    if (value === null || value === this.getCell(selectedCellPosition).value)
      return;

    const validator = new Validator(this.table);
    const isValidated = validator.check(selectedCellPosition, value);

    if (isValidated) {
      this.getCell(selectedCellPosition).value = value;
      const validValuesAmount = this.table.reduce((prev, line) => {
        const lineCount = line.reduce((prev, cell) => {
          if (cell.value) return prev + 1;
          return prev;
        }, 0);
        return prev + lineCount;
      }, 0);

      if (validValuesAmount === 81) this.win();
      return;
    }

    this.render.makeCellInvalid(selectedCellPosition);
    this.getCell(selectedCellPosition).isEditable = false;
    setTimeout(() => {
      this.render.makeCellValid(selectedCellPosition);
      this.getCell(selectedCellPosition).value = null;
      this.getCell(selectedCellPosition).isEditable = true;
      this.render.writeValue(selectedCellPosition, '');
    }, 1500);
  }

  private win() {
    this.render.openModal('win-modal');
  }

  public restart() {
    let isValuesCreated = false;

    while (!isValuesCreated) {
      isValuesCreated = this.createValues();
    }

    this.render.writeAllValues(this.table);
  }

  public stop() {}

  public start() {
    this.render.execute();
  }
}
