import type { TPosition, TTable } from '../validator';

import './style.css';

type TElementsTableRow = HTMLSpanElement[];
type TElementsTable = TElementsTableRow[];

type Props = {
  container: Element;
  table: TTable;
  restart: () => void;
  setValue: (value: number | null) => void;
  onSelectCell: (position: TPosition) => void;
};

type TRenderModalProps = {
  modalId: string;
  title: string;
  text: string;
  cancelButtonText?: string;
  cancelButtonShow?: boolean;
  onCancel?: () => void;
  confirmButtonText?: string;
  confirmButtonShow?: boolean;
  onConfirm: () => void;
};

export class Render {
  private container: Element;
  private table: TTable;
  private restart: () => void;
  private setValue: (value: number | null) => void;
  private onSelectCell: (position: TPosition) => void;
  private elementsTable: TElementsTable;

  constructor({ container, table, restart, setValue, onSelectCell }: Props) {
    this.container = container;
    this.table = table;
    this.restart = restart;
    this.setValue = setValue;
    this.onSelectCell = onSelectCell;
    this.elementsTable = [];
  }

  private getElement({ y, x }: TPosition): HTMLSpanElement {
    return this.elementsTable[y][x];
  }

  public setTable(table: TTable) {
    this.table = table;
  }

  public selectCell(position: TPosition) {
    this.getElement(position).classList.add('selected');
  }

  public unselectCell(position: TPosition) {
    this.getElement(position).classList.remove('selected');
  }

  public makeCellInvalid(position: TPosition) {
    this.getElement(position).classList.add('invalidValue');
  }

  public makeCellValid(position: TPosition) {
    this.getElement(position).classList.remove('invalidValue');
  }

  public writeValue(position: TPosition, value: string) {
    this.getElement(position).innerText = value;
  }

  public writeAllValues(table?: TTable) {
    if (table) this.setTable(table);

    this.table.forEach((line, y) => {
      line.forEach((cell, x) => {
        this.getElement({ x, y }).innerText = cell.value?.toString() ?? '';
        if (!cell.isEditable)
          this.getElement({ x, y }).classList.add('isNotEditable');
        else this.getElement({ x, y }).classList.remove('isNotEditable');
      });
    });
  }

  public destroy() {
    this.container.innerHTML = '';
  }

  private renderModal({
    modalId,
    title,
    text,
    cancelButtonText = 'Não',
    cancelButtonShow = true,
    onCancel,
    confirmButtonText = 'Sim',
    confirmButtonShow = true,
    onConfirm,
  }: TRenderModalProps) {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.id = modalId;

    const contentContainer = document.createElement('div');

    const header = document.createElement('h2');
    header.innerText = title;

    const innerContainer = document.createElement('div');

    const textContainer = document.createElement('p');
    textContainer.innerText = text;

    const buttonsContainer = document.createElement('div');

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.classList = 'btn-danger';
    cancelButton.innerText = cancelButtonText;
    cancelButton.addEventListener(
      'click',
      onCancel
        ? onCancel
        : () => {
            modalContainer.style.display = 'none';
          }
    );

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.classList = 'btn-primary';
    confirmButton.innerText = confirmButtonText;
    confirmButton.addEventListener('click', () => {
      onConfirm();
      modalContainer.style.display = 'none';
    });

    if (cancelButtonShow) buttonsContainer.appendChild(cancelButton);
    if (confirmButtonShow) buttonsContainer.appendChild(confirmButton);

    innerContainer.appendChild(textContainer);
    innerContainer.appendChild(buttonsContainer);

    contentContainer.appendChild(header);
    contentContainer.appendChild(innerContainer);

    modalContainer.appendChild(contentContainer);

    this.container.appendChild(modalContainer);
  }

  public openModal(id: string): boolean {
    const modal = document.querySelector<HTMLDivElement>(`#${id}`);
    if (modal) {
      modal.style.display = 'flex';
      return true;
    }
    return false;
  }

  public execute() {
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
          this.onSelectCell({ x, y });
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
      const restartModal =
        document.querySelector<HTMLDivElement>('#restart-modal');
      if (restartModal) restartModal.style.display = 'flex';
    });

    optionsContainer.appendChild(restartButton);

    buttonsContainer.appendChild(optionsContainer);

    this.container.appendChild(buttonsContainer);

    // Modals
    this.renderModal({
      modalId: 'restart-modal',
      title: 'Reiniciar Jogo',
      text: 'Tem certeza que deseja começar um novo jogo?',
      onConfirm: () => {
        this.restart();
      },
    });

    // Modals
    this.renderModal({
      modalId: 'win-modal',
      title: 'Parabens, você conseguiu!!!',
      text: 'Deseja começar um novo jogo?',
      onConfirm: () => {
        this.restart();
      },
    });

    this.writeAllValues();
  }
}
