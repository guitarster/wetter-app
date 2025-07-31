export function roundNumber(number) {
  return Math.floor(number);
}

export function formatHourlyTime(time) {
  return time.split(" ")[1].split(":")[0];
}

export function splitTime(time) {
  return time.split(" ")[0];
}

export function splitTimePM(time) {
  const rareTime = splitTime(time);
  const rareTimeFirstEl = rareTime.split(":")[0];
  const rareTimeSecondEl = rareTime.split(":")[1];

  return `${Number(rareTimeFirstEl) + 12}:${rareTimeSecondEl}`;
}
