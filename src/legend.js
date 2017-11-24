/**
 * Created by fed on 2017/11/20.
 */
import * as d3 from 'd3';

import genColor from './color';

export function init() {
  const {
    clientWidth,
    clientHeight
  } = document.body;
  d3.select('body')
    .append('div')
    .property('id', 'legend')
    .append('svg')
    .attr('width', clientWidth / 2)
    .attr('height', clientHeight / 2);
}

let lastw = 0;

export default function draw(d, init) {
  const data = d.map(item => {
    if (!item.color) {
      item.color = genColor();
    }
    return item;
   });
  const dt = d3
    .select('#legend svg')
    .selectAll('g')
    .data(data, function (data) {
      return data.key;
    });
  const newG = dt.enter()
      .append('g');

  newG.append('rect')
    .attr('height', 36)
    .attr('style', dd =>  'fill: rgb(' + dd.color + ')')
    .attr('x', 0)
    .attr('y', 0);

  newG
    .append('text')
    .attr('style', 'font-size: 24px;')
    .attr('transform', 'translate(4, 26)')
    .attr('class', 'sale-count');


  newG.append('text')
    .attr('style', 'font-size: 24px;')
    .attr('class', 'site-name')
    .attr('fill', dd => 'rgba(' + dd.color + ', .8)');
  let saleCount;
  const g = newG.merge(dt);
  if (init) {
    saleCount = g.select('.sale-count')
      .text(function (data) {
        return data.prefix + data.prefix ? data.count.toFixed(2) : data.count;
      });
  } else {
    saleCount = g.select('.sale-count')
      .transition()
      .duration(1500)
      .tween('text', function (data) {
        const i = d3.interpolate(parseFloat(data.prefix ? this.textContent.slice(1) : this.textContent, 10) || data.count, data.count);
        return (t) => {
          if (!data.prefix)
            this.textContent = data.prefix + Math.ceil(i(t));
          else {
            this.textContent = data.prefix + (i(t).toFixed(2));
          }
        };
      });
  }
  let wordWidth = 0;
  saleCount.each(function () {
    const w = this.clientWidth || this.getComputedTextLength();
    if (w > wordWidth) wordWidth = w;
  });
  wordWidth += 4;
  wordWidth = Math.max(wordWidth, lastw);
  lastw = wordWidth;

  g.select('rect')
    .attr('width', wordWidth + 8);
  // g.select('.site-name')
  //   .text(function (data) {
  //     return data.key;
  //   }).attr('transform', 'translate(' + [wordWidth + 10, 26] + ')');

  g.transition()
  .duration(500)
  .attr('transform', function (_, index) {
    return 'translate(' + [0, index * 40] + ')';
  });
}