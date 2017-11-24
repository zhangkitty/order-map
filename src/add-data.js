/**
 * Created by fed on 2017/11/21.
 */
import showPoint from './show-point';
import {
  drawPersistQueue,
  drawTemporaryBase,
} from './schedule-render';
import traceTo from './trace-to';
import genColor, { genColorLighter } from './color';

const points ={};

function update(p, n = 1) {
  const key = p.join('-/');
  if (!points[key]) {
    points[key] = {
      color: genColor(),
      count: n,
    };
    drawTemporaryBase(function (ctx) {
      showPoint(p, points[key].color, Math.pow(points[key].count, .6) / 100 + .02, ctx);
    });
    drawPersistQueue(function (ctx) {
      showPoint(p, points[key].color, Math.pow(points[key].count, .6) / 100 + .02, ctx);
    });
  } else {
    points[key].count += n;
  }
}

export default function addData(pos1, pos2, projection, n = 0) {
  const p1 = projection(pos1);
  const p2 = projection(pos2);
  update(p1, n);
  update(p2, n);
  if (!n)
    traceTo(pos1, pos2, projection, genColorLighter());
}

export function initNJ(pos, projection) {
  const p = projection(pos);
  const key = p.join('-/');
  points[key] = {
    color: genColor(),
    count: 100,
  };
  setTimeout(function () {
    drawTemporaryBase(function (ctx) {
      showPoint(p, points[key].color, Math.pow(points[key].count, .6) / 100 + .02, ctx);
    });
    drawPersistQueue(function (ctx) {
      showPoint(p, points[key].color, Math.pow(points[key].count, .6) / 100 + .02, ctx);
    });
  }, 100);
}