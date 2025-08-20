import { DefaultElement } from '../default-element';

import './style.css';

type Props = {
  className?: string;
  id?: string;
};

export class Button extends DefaultElement<HTMLButtonElement> {
  constructor(props?: Props) {
    super(document.createElement('button'));
    this.element.type = 'button';
    this.element.className = props?.className ?? '';
    this.element.id = props?.id ?? '';
  }
}
