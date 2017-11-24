/**
 * Created by fed on 2017/11/19.
 */
import * as d3 from 'd3';

import worldCountries from './world-countries.json';

export default function () {
  const {
    clientHeight,
    clientWidth,
  } = document.body;
  const projection = d3.geoMercator()
    .scale(clientWidth / 6.5)
    .translate([clientWidth / 2, clientHeight / 1.6]);
  const path = d3.geoPath(projection);

  const map = d3
    .select('body')
    .append('div')
    .attr('id', 'map')
    .append('svg')
    .selectAll('path.feature')
    .data(worldCountries.features)
    .enter()
    .append('path')
    .attr('class', 'feature')
    .attr('d', path);
  return projection;
}
