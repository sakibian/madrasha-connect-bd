interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

interface NextPrayer {
  name: string;
  time: Date;
  remaining: number;
}

const DHAKA_LAT = 23.8103;
const DHAKA_LON = 90.4125;
const TIMEZONE_OFFSET = 6;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function julianDay(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

function sunDeclination(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_rad = M * DEG_TO_RAD;
  const C = (1.9146 - 0.004817 * T) * Math.sin(M_rad) + 0.019993 * Math.sin(2 * M_rad);
  const sunLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = (sunLong - 0.00569 - 0.00478 * Math.sin(omega * DEG_TO_RAD)) * DEG_TO_RAD;
  const epsilon = (23.439 - 0.00000036 * T) * DEG_TO_RAD;
  const declination = Math.asin(Math.sin(epsilon) * Math.sin(lambda));
  return declination * RAD_TO_DEG;
}

function equationOfTime(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_rad = M * DEG_TO_RAD;
  const C = (1.9146 - 0.004817 * T) * Math.sin(M_rad) + 0.019993 * Math.sin(2 * M_rad);
  const sunLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = (sunLong - 0.00569 - 0.00478 * Math.sin(omega * DEG_TO_RAD)) * DEG_TO_RAD;
  const epsilon = (23.439 - 0.00000036 * T) * DEG_TO_RAD;
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  const L0_rad = L0 * DEG_TO_RAD;
  const eot = (L0_rad - alpha) * RAD_TO_DEG;
  return eot * 4 / 60;
}

function calculateSunriseSunset(jd: number, lat: number, lon: number, declination: number, depression: number): [number, number] {
  const lat_rad = lat * DEG_TO_RAD;
  const decl_rad = declination * DEG_TO_RAD;
  const cosH = (-Math.sin(decl_rad) * Math.sin(lat_rad) - Math.cos(depression * DEG_TO_RAD)) / (Math.cos(decl_rad) * Math.cos(lat_rad));
  if (cosH < -1 || cosH > 1) {
    return [0, 0];
  }
  const H = Math.acos(cosH) * RAD_TO_DEG;
  const noon = 12 - TIMEZONE_OFFSET - lon / 15;
  const rise = noon - H / 15;
  const set = noon + H / 15;
  return [rise, set];
}

function dateToHours(date: Date): number {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
}

function hoursToDate(hours: number, reference: Date): Date {
  const date = new Date(reference);
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = Math.floor(((hours - h) * 60 - m) * 60);
  date.setHours(h, m, s, 0);
  return date;
}

function getPrayerTimes(date: Date): PrayerTimes {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const jd = julianDay(year, month, day);
  const decl = sunDeclination(jd);
  const eot = equationOfTime(jd);
  const lat_rad = DHAKA_LAT * DEG_TO_RAD;
  const decl_rad = decl * DEG_TO_RAD;
  const noon = 12 - TIMEZONE_OFFSET - DHAKA_LON / 15 + eot;
  const fajrAngle = 18 * DEG_TO_RAD;
  const ishaAngle = 18 * DEG_TO_RAD;
  const sunriseDepression = -0.833;
  const [sunriseHours] = calculateSunriseSunset(jd, DHAKA_LAT, DHAKA_LON, decl, sunriseDepression);
  const [, sunsetHours] = calculateSunriseSunset(jd, DHAKA_LAT, DHAKA_LON, decl, sunriseDepression);
  const fajrHours = sunriseHours - (1.5 * 60 / 3600);
  const dhuhrHours = noon + 1.5 / 60;
  const tanAlt = Math.abs(Math.tan(lat_rad - decl_rad));
  const asrAngle = Math.atan(1 / (1 + tanAlt));
  const asrAlt = Math.PI / 2 - asrAngle;
  const [asrHours] = calculateSunriseSunset(jd, DHAKA_LAT, DHAKA_LON, decl, asrAlt * RAD_TO_DEG);
  const maghribHours = sunsetHours + 1.5 / 60;
  const ishaHours = maghribHours + (1.25 * 60 / 3600);
  return {
    fajr: hoursToDate(fajrHours + TIMEZONE_OFFSET + DHAKA_LON / 15, date),
    sunrise: hoursToDate(sunriseHours + TIMEZONE_OFFSET + DHAKA_LON / 15, date),
    dhuhr: hoursToDate(dhuhrHours + TIMEZONE_OFFSET + DHAKA_LON / 15, date),
    asr: hoursToDate(asrHours + TIMEZONE_OFFSET + DHAKA_LON / 15, date),
    maghrib: hoursToDate(maghribHours + TIMEZONE_OFFSET + DHAKA_LON / 15, date),
    isha: hoursToDate(ishaHours + TIMEZONE_OFFSET + DHAKA_LON / 15, date),
  };
}

function getNextPrayer(date: Date): NextPrayer {
  const times = getPrayerTimes(date);
  const prayers = [
    { name: 'Fajr', time: times.fajr },
    { name: 'Sunrise', time: times.sunrise },
    { name: 'Dhuhr', time: times.dhuhr },
    { name: 'Asr', time: times.asr },
    { name: 'Maghrib', time: times.maghrib },
    { name: 'Isha', time: times.isha },
  ];
  for (const prayer of prayers) {
    if (prayer.time > date) {
      const remaining = Math.floor((prayer.time.getTime() - date.getTime()) / 1000);
      return { name: prayer.name, time: prayer.time, remaining };
    }
  }
  return { name: 'Fajr', time: times.fajr, remaining: 0 };
}

export { PrayerTimes, NextPrayer, getPrayerTimes, getNextPrayer };
