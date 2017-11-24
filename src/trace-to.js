/**
 * Created by fed on 2017/11/20.
 */
import * as d3 from 'd3';
import {
  drawTemporary
} from './schedule-render';

function getAnimationTime() {
  return 2 + .5 * Math.random();
}
function noop() {

}

let queue = [];
let lastOk = 0;
function run() {
  if (!queue.length) {
    if (lastOk--) {
      drawTemporary(function () {});
      setTimeout(run, 16);
    }
    return;
  }
  lastOk = 8;
  const t = d3.now();
  queue.forEach(({ fn, t0 }) => fn(t - t0));
  queue = queue.filter(({ t1 }) => t1 - t > -1);

  setTimeout(run, 16);
}

function schedule(fn, time) {
  queue.push({
    fn,
    t0: d3.now(),
    t1: d3.now() + time,
  });
  if (queue.length === 1) run();
}

function noThrowCreate(ctx, x2, y2, x3, y3) {
  try {
   return ctx.createLinearGradient(x2, y2, x3, y3);
  } catch(e) {
    return null;
  }
}

export default function ([x0, y0], [x1, y1], projection, color, cb = noop) {
  const animationTime = getAnimationTime();
  schedule(function (time) {
    const ratio = time / (animationTime * 1000);
    const r = d3.easeLinear(ratio);
    if (r > 0.99) return;
    const x2_ = x0 + (x1 - x0) * r;
    const y2_ = y0 + (y1 - y0) * r;
    const x3_ = x0 + (x1 - x0) * Math.max(0, r - .3);
    const y3_ = y0 + (y1 - y0) * Math.max(0, r - .3);
    const [x2, y2] = projection([x2_, y2_]);
    const [x3, y3] = projection([x3_, y3_]);

    drawTemporary(function (ctx) {
      const gradient = noThrowCreate(ctx, x2, y2, x3, y3);
      if (!gradient) return;

      ctx.save();
      gradient.addColorStop(0, `rgba(${color.join(',')}, 1)`);
      gradient.addColorStop(1, `rgba(${color.join(',')}, 0)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.stroke();

      ctx.restore();
    });
  }, animationTime * 1000);
}