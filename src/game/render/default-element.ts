import type { Button } from './button';
import type { Div } from './div';
import type { Span } from './span';

type TElement = Div | Span | Button | Element;

export class DefaultElement<T extends HTMLElement> {
  protected element: T;

  constructor(element: T) {
    this.element = element;
  }

  public get(): T {
    return this.element;
  }

  public addClassName(className: string) {
    this.element.classList.add(className);
  }

  public removeClassName(className: string) {
    this.element.classList.remove(className);
  }

  public innerText(text: string) {
    this.element.innerText = text;
  }

  public innerHTML(text: string) {
    this.element.innerHTML = text;
  }

  public appendChild(node: TElement) {
    if (node instanceof Element) {
      this.element.appendChild(node);
      return;
    }
    this.element.appendChild(node.get());
  }

  public render(parent: TElement) {
    if (parent instanceof Element) {
      parent.appendChild(this.element);
      return;
    }

    parent.get().appendChild(this.element);
  }
}
