/**
 * Created by fed on 2017/11/19.
 */
import * as d3 from 'd3';
import moment from 'moment';
import {
  initNJ
} from './src/add-data';

moment.tz.setDefault('America/Los_Angeles');

import drawLegend, {
  init,
} from './src/legend'
import initCanvas from './src/canvas';
import drawMap from './src/draw-map';
import {
  startSchedule,
  redrawBase,
} from './src/schedule-render';
import addData from './src/add-data';
import {
  loadSumData,
  loadWaterData,
} from './src/fetch-data';

init();
initCanvas();
const projection = drawMap();
startSchedule();

const NJ = [118.7969, 32.0603];

let lastT = Date.now();

function sleep1S() {
  const n = Math.max(0, 2000 - (Date.now() - lastT));
  lastT = Date.now();
  return new Promise(function (resolve) {
    setTimeout(resolve, n);
  });
}

function getNow() {
  return moment().subtract(10 * 60, 'seconds').unix();
}

async function start() {
  const rawData = [
    {
      key: 'Total',
      count: 0,
      prefix: '',
    },
  ];
  let waterData;
  const Pro = Promise.all([loadSumData(), loadWaterData()]);

  let now = Date.now();
  // TODO
  setTimeout(function loadData() {
    const nextT = 10 * 60 * 1000 - (Date.now() - now);
    now = Date.now();
    loadWaterData().then(function (d) {
      d.data = d.data || [];
      waterData = waterData.concat(d.data).sort((b, a) => b.pay_time - a.pay_time)
    });
    setTimeout(loadData, nextT);
  }, 1000 * 60 * 5);
  let [{
    data,
    total
  }, {
    data: waterData0,
  }] = await Pro;
  rawData[0].count = Number(total);
  waterData = (waterData0 || []).sort((b, a) => b.pay_time - a.pay_time);
  initNJ(NJ, projection);
  (data || []).forEach(({ip_latitude, ip_longitude, order_cnt}) => {
    addData(NJ, [ip_longitude, ip_latitude], projection, order_cnt);
  });
  drawLegend(rawData, true);
  setTimeout(redrawBase, 1500);
  while (true) {
    const no = getNow();
    while (waterData[0] && waterData[0].pay_time < no) {
      addData(NJ, [waterData[0].ip_longitude, waterData[0].ip_latitude], projection);
      rawData[0].count += 1;
      waterData.shift();
    }
    drawLegend(rawData);
    await sleep1S();
  }
}

start();
