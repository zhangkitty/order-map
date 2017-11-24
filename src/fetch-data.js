/**
 * Created by fed on 2017/11/21.
 */
import moment from 'moment';
import querystring from 'querystring';
moment.tz.setDefault('America/Los_Angeles');

const statics = '/Activity/getOrderSumAnalysis';
const water = '/Activity/getOrderDetailAnalysis';

export async function loadSumData() {
  const { debug } = querystring.parse(location.search.slice(1));
  const start = moment(!debug ? moment().format('YYYY-MM-DD') : undefined);
  const end = moment().subtract(10, 'minutes').unix();
  return fetch(`${statics}?start_time=${start.unix()}&end_time=${end}`).then(r => r.json())
}

let lastTime;

export async function loadWaterData() {
  let startTime;
  if (!lastTime) {
    startTime = moment().subtract(10, 'minutes');
  } else {
    startTime = lastTime;
  }
  const endTime = moment(startTime).add(5, 'minutes');
  lastTime = endTime;

  const start = startTime.unix();
  const end = endTime.unix();
  return fetch(`${water}?start_time=${start}&end_time=${end}`).then(r => r.json())
    .then(res => Object.assign({}, res, {
      data: res.data.map(item => Object.assign({}, item, {
        pay_time: Number(item.pay_time)
      }))
    }))
}