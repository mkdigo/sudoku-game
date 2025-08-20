import { DefaultElement } from '../default-element';

type Props = {
  className?: string;
  id?: string;
};

export class Div extends DefaultElement<HTMLDivElement> {
  constructor(props?: Props) {
    super(document.createElement('div'));
    this.element.className = props?.className ?? '';
    this.element.id = props?.id ?? '';
  }
}
