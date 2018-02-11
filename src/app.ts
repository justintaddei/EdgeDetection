import { FileDropHandler } from './util/file-drop-handler';
import { CanvasEditor } from "./canvas-editor";

// Get the cavnas from the document
const rawCanvasElement = <HTMLCanvasElement>document.getElementById('rawCanvas');
const previewCanvasElement = <HTMLCanvasElement>document.getElementById('previewCanvas');

// Get the ConvasContext from the canvas
const rawCanvas = new CanvasEditor(rawCanvasElement);
const previewCanvas = new CanvasEditor(previewCanvasElement);

// Listen for images to be dropped on the "raw canvas"
const fileDropHandler = new FileDropHandler(rawCanvasElement);


fileDropHandler.addEventListener('file-ready', async e => {
  // Clear the canvas in case there
  // was an image on it already
  rawCanvas.clear()

  // Fill the "raw canvas" with the new image
  await rawCanvas.fillImage(e.detail);

  // Apply a kernel to the "preview canvas"
  previewCanvas.applyKernel(rawCanvas.getImageData(), [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
  ]);
});


/*

Examples of edge detection kernels:

(Bidirectional)
[-1, -1, -1],
[-1,  8, -1],
[-1, -1, -1]

(Vertical edges)
[-1,  0,  1],
[-1,  0,  1],
[-1,  0,  1]

(Horizontal edges)
[-1, -1, -1],
[ 0,  0,  0],
[ 1,  1,  1]



*/