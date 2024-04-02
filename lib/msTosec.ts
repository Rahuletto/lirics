export default function msTosec(millis: number) {
  var seconds = (millis / 1000).toFixed(0);
  return Number(seconds);
}
