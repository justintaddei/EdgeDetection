class CanvasEditor {
  /**
   * The height of the canvas
   */
  height: number;
  /**
   * The width of the canvas
   */
  width: number;
  /**
   * Methods and properties for drawing and manipulating
   * images and graphics on a canvas element in a document.
   * A context object includes information about colors,
   * line widths, fonts, and other graphic parameters
   * that can be drawn on a canvas.
   */
  context: CanvasRenderingContext2D;
  /**
   * The HTMLCanvasElement
   */
  canvasElement: HTMLCanvasElement;

  /**
   * Returns the value of the pixel at `imageData(x, y)`
   * @param imageData The `ImageData`
   * @param x The x coordinate
   * @param y The y coordinate
   */
  static getPixel(imageData: ImageData, x: number, y: number): number {
    return imageData.data[(imageData.width * 4 * y) + x * 4] || 0;
  }

  /**
   * Sets the value for the pixel at `imageData(x, y)` to `value`
   * @param imageData The `ImageData`
   * @param x The x coordinate
   * @param y The y coordinate
   * @param value The new value for the pixel
   */
  static setPixel(imageData: ImageData, x: number, y: number, value: number) {
    imageData.data[((imageData.width * 4 * y) + x * 4)] = value;
    imageData.data[((imageData.width * 4 * y) + x * 4) + 1] = value;
    imageData.data[((imageData.width * 4 * y) + x * 4) + 2] = value;
    imageData.data[((imageData.width * 4 * y) + x * 4) + 3] = 255;
  }

  /**
   * Converts an RGB image to monochrome
   * @param imageData The `ImageData`
   */
  static toMono(imageData: ImageData) {
    for (let i = 0, n = imageData.data.length; i < n; i += 4) {
      const grayscale = imageData.data[i] * 0.3 + imageData.data[i + 1] * 0.59 + imageData.data[i + 2] * 0.11;
      imageData.data[i] = grayscale;  // red
      imageData.data[i + 1] = grayscale;  // green
      imageData.data[i + 2] = grayscale;  // blue
    }
  }

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;

    // Get the `CanvasRenderingContext2D` of `this.canvasElement`
    this.context = this.canvasElement.getContext('2d');

    // Store the width and height of the canvas
    this.width = this.canvasElement.width;
    this.height = this.canvasElement.height;
  }

  /**
   * Clears the canvas
  */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Fills the canvas with the given image
   * @param url An object URL pointing to an image
   */
  fillImage(url: string): Promise<void> {
    return new Promise(resolve => {
      // Create a new image
      const img = new Image();

      // Wait for the image to load
      img.addEventListener('load', () => {
        // Get the natural width and height of the image
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Resize the image to fit on the canvas
        if (width > height) {
          width = this.width;
          height = this.height * img.naturalHeight / img.naturalWidth;
        } else {
          height = this.height;
          width = this.width * img.naturalWidth / img.naturalHeight;
        }

        // Draw the image to the canvas
        this.context.drawImage(img, (this.width - width) / 2, (this.height - height) / 2, width, height);
        resolve();
      });

      // Set the source of the image to the object url
      img.src = url;
    });
  }

  /**
   * Returns the ImageData of the canvas
  */
  getImageData(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  /**
   * Puts the given `ImageData` onto the canvas
   * @param imageData The new `ImageData`
   */
  putImageData(imageData: ImageData) {
    this.context.putImageData(imageData, 0, 0);
  }

  /**
   * Replaces the canvas data with the given `kernel` applied to the given `ImageData`
   * @param imageData The `ImageData` to apply the `kernel` to
   * @param kernel The kernel to be applied to the canvas
   */
  applyKernel(imageData: ImageData, kernel: number[][]) {
    // Convert the ImageData to monochrome
    CanvasEditor.toMono(imageData);

    // Create a new ImageData object of the same dimensions
    let newImageData = this.context.createImageData(this.width, this.height);

    // Loop over every pixel in the image
    for (let x = 0; x < imageData.width; x++) {
      for (let y = 0; y < imageData.height; y++) {
        /** The some of all the pixels "under" the kernel */
        let sum = 0;

        // Loop over the kernel
        for (let kY = 0; kY < kernel.length; kY++) {
          for (let kX = 0; kX < kernel[kY].length; kX++) {
            /** The value at kernel(kX, kY) */
            const multiplier = kernel[kY][kX];

            /** The value of the pixel at `ImageData(x + kX, y + kY)` */
            const pixel = CanvasEditor.getPixel(
              imageData,
              x + (kX - (kernel[kY].length - 1) / 2),
              y + (kY - (kernel.length - 1) / 2)
            );

            // Add the value to the sum
            sum += multiplier * pixel;
          }
        }

        // Set the pixel at `ImageData(x, y)` the sum
        CanvasEditor.setPixel(newImageData, x, y, sum);
      }
    }

    // Put the new `ImageData` onto the canvas
    this.putImageData(newImageData);
  }
}

export { CanvasEditor };