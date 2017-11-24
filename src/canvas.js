/**
 * Created by fed on 2017/11/19.
 */
import * as d3 from 'd3';
import $ from 'jquery';

let context;
let context1;
let offCanvas;

export default function initCanvas() {
  const {
    clientWidth,
    clientHeight,
  } = document.body;
  d3.select('body')
    .append('div')
    .attr('id', 'canvas')
    .append('canvas')
    .attr('width', clientWidth)
    .attr('height', clientHeight)
    .each(function () {
      context = this.getContext('2d')
    });
  context.globalCompositeOperation = 'lighter';

  d3.select('body')
    .append('div')
    .attr('id', 'canvas1')
    .append('canvas')
    .attr('width', clientWidth)
    .attr('height', clientHeight)
    .each(function () {
      context1 = this.getContext('2d')
    });
  // context1.globalCompositeOperation = 'destination-atop';

  offCanvas = $('<canvas></canvas>')
    .prop('width', clientWidth)
    .prop('height', clientHeight)[0];
  offCanvas.getContext('2d').globalCompositeOperation = 'lighter'
}

export function clearCanvas() {
  const {
    clientWidth,
    clientHeight,
  } = document.body;
  offCanvas.getContext('2d').clearRect(0, 0, clientWidth, clientHeight);
}

export function clearCanvasTrace() {
  const {
    clientWidth,
    clientHeight,
  } = document.body;
  context1.clearRect(0, 0, clientWidth, clientHeight);
}

export function getCanvasCtx() {
  return offCanvas.getContext('2d');
}

export function getCanvasRealCtx() {
  return context;
}

export function getCanvasCtxTrace() {
  return context1;
}

export function commitDraw() {
  const {
    clientWidth,
    clientHeight,
  } = document.body;
  const offCanvas1 = $('#canvas canvas')[0];
  $('#canvas canvas').remove();
  $('#canvas').append(offCanvas);
  context = offCanvas1.getContext('2d');
  offCanvas = offCanvas1;
  context.clearRect(0, 0, clientWidth, clientHeight);
}