export type TCell = {
  value: number | null;
  isEditable: boolean;
};
export type TLine = TCell[];
export type TTable = TLine[];
export type TPosition = {
  x: number;
  y: number;
};

export class Validator {
  constructor(private table: TTable) {}

  public setTable(table: TTable): void {
    this.table = table;
  }

  private checkLine(y: number, value: number): boolean {
    for (const cell of this.table[y]) {
      if (cell.value === value) return false;
    }
    return true;
  }

  private checkColumn(x: number, value: number): boolean {
    for (const line of this.table) {
      if (line[x].value === value) return false;
    }
    return true;
  }

  private checkGroup(position: TPosition, value: number): boolean {
    for (let i = 0; i < 3; i++) {
      const line = i + 3 * Math.floor(position.y / 3);
      for (let j = 0; j < 3; j++) {
        const cell = j + 3 * Math.floor(position.x / 3);
        if (this.table[line][cell].value === value) return false;
      }
    }
    return true;
  }

  public check(position: TPosition, value: number): boolean {
    if (value < 1 || value > 9)
      throw new Error('The value must be between 1 and 9');

    if (!this.checkLine(position.y, value)) return false;
    if (!this.checkColumn(position.x, value)) return false;
    if (!this.checkGroup(position, value)) return false;

    return true;
  }
}
