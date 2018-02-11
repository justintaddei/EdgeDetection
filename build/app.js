(function () {
'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}











function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Emitter = (function () {
    function Emitter() {
        var _this = this;
        var delegate = document.createDocumentFragment();
        [
            'addEventListener',
            'dispatchEvent',
            'removeEventListener'
        ].forEach(function (f) {
            return _this[f] = function () {
                var xs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    xs[_i] = arguments[_i];
                }
                return delegate[f].apply(delegate, xs);
            };
        });
    }
    return Emitter;
}());

//# sourceMappingURL=emitter.js.map

var FileDropHandler = (function (_super) {
    __extends(FileDropHandler, _super);
    function FileDropHandler(element) {
        var _this = _super.call(this) || this;
        _this.targetElement = element;
        _this.targetElement.addEventListener('dragover', function (e) {
            e.preventDefault();
            _this.targetElement.classList.add('drag-target');
        }, false);
        _this.targetElement.addEventListener('dragleave', function () {
            _this.targetElement.classList.remove('drag-target');
        }, false);
        _this.targetElement.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.targetElement.classList.remove('drag-target');
            if (!e.dataTransfer.files[0] || e.dataTransfer.files[0].type.indexOf('image') === -1) {
                console.log(!e.dataTransfer.files[0] ? 'No file to load' : "Uknown file type: " + e.dataTransfer.files[0].type);
                return false;
            }
            if (_this.lastObjectURL)
                URL.revokeObjectURL(_this.lastObjectURL);
            _this.lastObjectURL = URL.createObjectURL(e.dataTransfer.files[0]);
            var event = new CustomEvent('file-ready', {
                detail: _this.lastObjectURL
            });
            _this.dispatchEvent(event);
        }, false);
        return _this;
    }
    return FileDropHandler;
}(Emitter));

var CanvasEditor = (function () {
    function CanvasEditor(canvasElement) {
        this.canvasElement = canvasElement;
        this.context = this.canvasElement.getContext('2d');
        this.width = this.canvasElement.width;
        this.height = this.canvasElement.height;
    }
    CanvasEditor.getPixel = function (imageData, x, y) {
        return imageData.data[(imageData.width * 4 * y) + x * 4] || 0;
    };
    CanvasEditor.setPixel = function (imageData, x, y, value) {
        imageData.data[((imageData.width * 4 * y) + x * 4)] = value;
        imageData.data[((imageData.width * 4 * y) + x * 4) + 1] = value;
        imageData.data[((imageData.width * 4 * y) + x * 4) + 2] = value;
        imageData.data[((imageData.width * 4 * y) + x * 4) + 3] = 255;
    };
    CanvasEditor.toMono = function (imageData) {
        for (var i = 0, n = imageData.data.length; i < n; i += 4) {
            var grayscale = imageData.data[i] * 0.3 + imageData.data[i + 1] * 0.59 + imageData.data[i + 2] * 0.11;
            imageData.data[i] = grayscale;
            imageData.data[i + 1] = grayscale;
            imageData.data[i + 2] = grayscale;
        }
    };
    CanvasEditor.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    CanvasEditor.prototype.fillImage = function (url) {
        var _this = this;
        return new Promise(function (resolve) {
            var img = new Image();
            img.addEventListener('load', function () {
                var width = img.naturalWidth;
                var height = img.naturalHeight;
                if (width > height) {
                    width = _this.width;
                    height = _this.height * img.naturalHeight / img.naturalWidth;
                }
                else {
                    height = _this.height;
                    width = _this.width * img.naturalWidth / img.naturalHeight;
                }
                _this.context.drawImage(img, (_this.width - width) / 2, (_this.height - height) / 2, width, height);
                resolve();
            });
            img.src = url;
        });
    };
    CanvasEditor.prototype.getImageData = function () {
        return this.context.getImageData(0, 0, this.width, this.height);
    };
    CanvasEditor.prototype.putImageData = function (imageData) {
        this.context.putImageData(imageData, 0, 0);
    };
    CanvasEditor.prototype.applyKernel = function (imageData, kernel) {
        CanvasEditor.toMono(imageData);
        var newImageData = this.context.createImageData(this.width, this.height);
        for (var x = 0; x < imageData.width; x++) {
            for (var y = 0; y < imageData.height; y++) {
                var sum = 0;
                for (var kY = 0; kY < kernel.length; kY++) {
                    for (var kX = 0; kX < kernel[kY].length; kX++) {
                        var multiplier = kernel[kY][kX];
                        var pixel = CanvasEditor.getPixel(imageData, x + (kX - (kernel[kY].length - 1) / 2), y + (kY - (kernel.length - 1) / 2));
                        sum += multiplier * pixel;
                    }
                }
                CanvasEditor.setPixel(newImageData, x, y, sum);
            }
        }
        this.putImageData(newImageData);
    };
    return CanvasEditor;
}());

//# sourceMappingURL=canvas-editor.js.map

var _this = undefined;
var rawCanvasElement = document.getElementById('rawCanvas');
var previewCanvasElement = document.getElementById('previewCanvas');
var rawCanvas = new CanvasEditor(rawCanvasElement);
var previewCanvas = new CanvasEditor(previewCanvasElement);
var fileDropHandler = new FileDropHandler(rawCanvasElement);
fileDropHandler.addEventListener('file-ready', function (e) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rawCanvas.clear();
                return [4, rawCanvas.fillImage(e.detail)];
            case 1:
                _a.sent();
                previewCanvas.applyKernel(rawCanvas.getImageData(), [
                    [-1, -1, -1],
                    [-1, 8, -1],
                    [-1, -1, -1]
                ]);
                return [2];
        }
    });
}); });
//# sourceMappingURL=app.js.map

}());

//# sourceMappingURL=app.js.map
