export interface Emitter {
  addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  dispatchEvent(evt: Event): boolean;
  removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

/**
 * A simply event emitter class
*/
export class Emitter {
  constructor() {
    var delegate = document.createDocumentFragment();
    [
      'addEventListener',
      'dispatchEvent',
      'removeEventListener'
    ].forEach(f =>
      this[f] = (...xs) => delegate[f](...xs)
    )
  }
}