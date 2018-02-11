import { Emitter } from './emitter';

interface FileReadyEvent extends CustomEvent<string> {
  /** The object URL of an image */
  detail: string;
}

interface FileDropHandler {
  addEventListener(type: 'file-ready', listener: (event: FileReadyEvent) => any);
}

/**
 * Adds Drag-Drop file upload capability to the given element
*/
class FileDropHandler extends Emitter {
  /**
   * The last object URL to be created
   * Used to revoke unused object URLs
   */
  private lastObjectURL: string;

  /**
   * The `HTMLElement`
   */
  private targetElement: HTMLElement;

  /**
   * Adds Drag-Drop file upload capability to the given element
   * @param element The `HTMLElement`
   */
  constructor(element: HTMLElement) {
    super();

    this.targetElement = element;

    // Listen for the `dragover` event
    this.targetElement.addEventListener('dragover', e => {
      // Stop the browser from doing things we don't want it to do
      e.preventDefault();

      // Add a class to the element to provide visual feedback
      this.targetElement.classList.add('drag-target');
    }, false);

    // Listen for the `dragleave` event
    this.targetElement.addEventListener('dragleave', () => {
      // Remove the class to the element to provide visual feedback
      this.targetElement.classList.remove('drag-target');
    }, false);

    // Listen for the `drop` event
    this.targetElement.addEventListener('drop', e => {
      // Stop the browser from doing things we don't want it to do
      e.preventDefault();
      e.stopPropagation();

      // Remove the class to the element to provide visual feedback
      this.targetElement.classList.remove('drag-target');

      // Make sure we actually have an image
      if (!e.dataTransfer.files[0] || e.dataTransfer.files[0].type.indexOf('image') === -1) {
        console.log(!e.dataTransfer.files[0] ? 'No file to load' : `Uknown file type: ${e.dataTransfer.files[0].type}`);
        return false;
      }

      // Revoke the last object URL if there is one
      if (this.lastObjectURL)
        URL.revokeObjectURL(this.lastObjectURL);

      // Create an object URL for the image
      this.lastObjectURL = URL.createObjectURL(e.dataTransfer.files[0]);

      // Let other code know the image is ready
      const event = new CustomEvent('file-ready', {
        detail: this.lastObjectURL
      });

      this.dispatchEvent(event);
    }, false);
  }
}

export { FileDropHandler };