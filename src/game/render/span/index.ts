import { DefaultElement } from '../default-element';

type Props = {
  className?: string;
  id?: string;
};

export class Span extends DefaultElement<HTMLSpanElement> {
  constructor(props?: Props) {
    super(document.createElement('span'));
    this.element.className = props?.className ?? '';
    this.element.id = props?.id ?? '';
  }
}
