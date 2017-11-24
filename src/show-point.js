/**
 * Created by fed on 2017/11/19.
 */
import $ from 'jquery';
import light from './light.png';
import {
  getCanvasCtx
} from './canvas';

const img = new Image();
img.src = light;
const imgPromise = new Promise(function (resolve, reject) {
  img.onload = resolve;
  img.onerror = reject;
});
let tempCanvas;

export default async function ([x, y], [r, g, b, a = 1], size = 1, ctx) {
  size = Math.min(size, 5);
  await imgPromise;
  const {
    width, height
  } = img;
  if (!tempCanvas) {
    tempCanvas = $('<canvas></canvas>')
      .prop('width', width)
      .prop('height', height)
      [0];
  }
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(img, 0, 0);
  tempCtx.scale(size, size);
  const newWidth = Math.ceil(width * size);
  const newHeight = Math.ceil(height * size);
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const dt = imageData.data;
  for (let i = 0; i < dt.length; i +=4) {
    dt[i + 3] = dt[i] * a;
    if (dt[i + 3]) {
      dt[i] = r;
      dt[i + 1] = g;
      dt[i + 2] = b;
    }
  }
  tempCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, x - newWidth / 2, y - newHeight / 2, newWidth, newHeight);
  tempCtx.scale(1/size, 1/size);
}