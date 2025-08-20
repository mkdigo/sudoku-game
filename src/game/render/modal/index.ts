import { Button } from '../button';
import { Div } from '../div';

import './style.css';

type Props = {
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

export class Modal {
  private element: Div;

  constructor({
    modalId,
    title,
    text,
    cancelButtonText = 'Não',
    cancelButtonShow = true,
    onCancel,
    confirmButtonText = 'Sim',
    confirmButtonShow = true,
    onConfirm,
  }: Props) {
    const modalContainer = new Div({ className: 'modal', id: modalId });

    const contentContainer = new Div();

    const header = document.createElement('h2');
    header.innerText = title;

    const innerContainer = new Div();

    const textContainer = document.createElement('p');
    textContainer.innerText = text;

    const buttonsContainer = new Div();

    const cancelButton = new Button({ className: 'btn-danger' });
    cancelButton.innerText(cancelButtonText);
    cancelButton.get().addEventListener(
      'click',
      onCancel
        ? onCancel
        : () => {
            this.close();
          }
    );

    const confirmButton = new Button({ className: 'btn-primary' });
    confirmButton.innerText(confirmButtonText);
    confirmButton.get().addEventListener('click', () => {
      onConfirm();
      this.close();
    });

    if (cancelButtonShow) cancelButton.render(buttonsContainer);
    if (confirmButtonShow) confirmButton.render(buttonsContainer);

    innerContainer.appendChild(textContainer);
    buttonsContainer.render(innerContainer);
    contentContainer.appendChild(header);
    innerContainer.render(contentContainer);
    contentContainer.render(modalContainer);

    this.element = modalContainer;
  }

  public open() {
    this.element.get().style.display = 'flex';
  }

  public close() {
    this.element.get().style.display = 'none';
  }

  public render(parent: Element) {
    this.element.render(parent);
  }
}
