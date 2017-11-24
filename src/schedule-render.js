/**
 * Created by fed on 2017/11/20.
 */
import * as d3 from 'd3';
import {
  getCanvasCtx,
  getCanvasRealCtx,
  clearCanvas,
  getCanvasCtxTrace,
  clearCanvasTrace,
  commitDraw,
} from './canvas';

const tempQueue = [];
const persistQueue = [];
const tempQueueBase = [];
let dirty = false;

function scheduleUpdate() {
  if (!dirty) {
    dirty = true;
    requestAnimationFrame(draw);
  }
}

function sleep() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 4);
  });
}

async function forEachAsync(arr, arg) {
  const l = arr.length;
  const step = 1;
  let i = 0;
  while (i < l) {
    for (let j = 0; j <= step; j++) {
      if (i >= l) break;
      arr[i](arg);
      i += 1;
    }
    await sleep();
  }
  return 0;
}

export function redrawBase() {
  clearCanvas();
  const ctx = getCanvasCtx();
  forEachAsync(persistQueue, ctx).then(function () {
    commitDraw();
    setTimeout(function () {
      redrawBase();
    }, 5 * 1000);
  });
}

export function startSchedule() {
  // d3.timer(draw);
}

export function drawTemporaryBase(fn) {
  tempQueueBase.push(fn);
  scheduleUpdate();
}

export function drawTemporary(fn) {
  // const idx = tempQueue.findIndex(item => item.id === id);
  // if (idx === -1) {
    tempQueue.push(fn);
    scheduleUpdate();
  // } else {
  //   tempQueue[idx] = {
  //     fn,
  //     id
  //   };
  // }
}

export function drawPersistQueue(fn) {
  persistQueue.push(fn);
}

function draw() {
  let fn;
  clearCanvasTrace();
  while (fn = tempQueue.shift())
    fn(getCanvasCtxTrace());

  const ctx = getCanvasRealCtx();
  while (fn = tempQueueBase.shift())
    fn(ctx);
  dirty = false;
}

