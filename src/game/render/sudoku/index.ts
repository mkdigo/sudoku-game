import type { TPosition, TTable } from '../../validator';
import { Div } from '../div';
import { Span } from '../span';

import './style.css';

type TSudokuTableRow = HTMLSpanElement[];
export type TSudokuTable = TSudokuTableRow[];

export class Sudoku {
  private element: Div;

  constructor() {
    this.element = new Div({ className: 'table' });
  }

  public create(
    table: TTable,
    onSelectCell: (position: TPosition) => void
  ): TSudokuTable {
    const sudokuTable: TSudokuTable = [];

    for (let y = 0; y < table.length; y++) {
      const row: TSudokuTableRow = [];
      const lineElement = new Div({ className: 'row' });
      lineElement.render(this.element);

      for (let x = 0; x < table[y].length; x++) {
        const cell = new Div({ className: 'cell' });
        const span = new Span();
        span.get().addEventListener('click', (event) => {
          event.stopPropagation();
          onSelectCell({ x, y });
        });
        span.render(cell);
        cell.render(lineElement);
        row.push(span.get());
      }
      sudokuTable.push(row);
    }

    return sudokuTable;
  }

  public render(parent: Element) {
    this.element.render(parent);
  }
}
