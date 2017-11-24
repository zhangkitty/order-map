/**
 * Created by fed on 2017/11/21.
 */
export default function genColor() {
  return [
    randomInScale(80, 160),
    randomInScale(80, 170),
    randomInScale(80, 160),
  ]
}

export function genColorLighter() {
  return [
    randomInScale(120, 223),
    randomInScale(120, 233),
    randomInScale(120, 210),
  ]
}


function randomInScale(start, end) {
  return Math.ceil(start + (end - start) * Math.random());
}
