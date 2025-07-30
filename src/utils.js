export function roundNumber(number) {
  return Math.floor(number);
}

export function formatHourlyTime(time) {
  return time.split(" ")[1].split(":")[0];
}
