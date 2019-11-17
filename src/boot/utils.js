import { date } from 'quasar';
import { i18n } from './i18n';

export default async ({ Vue }) => {
  const toDistance = distance => (Math.abs(distance) > 999
    ? `${Math.sign(distance) * ((Math.abs(distance) / 1000).toFixed(1))}km`
    : `${Math.sign(distance) * Math.abs(distance)}m`);

  Vue.prototype.$toDistance = toDistance;

  const dateFromNow = (dt) => {
    dt = dt instanceof Date ? dt : new Date(dt);
    const now = new Date();
    const diff = {
      years: date.getDateDiff(now, dt, 'years'),
      days: date.getDateDiff(now, dt, 'days'),
      months: date.getDateDiff(now, dt, 'months'),
      hours: date.getDateDiff(now, dt, 'hours'),
      minutes: date.getDateDiff(now, dt, 'minutes'),
      seconds: date.getDateDiff(now, dt, 'seconds'),
    };

    let unit = '';
    let quantity = 0;

    if (diff.years > 0) {
      quantity = diff.years;
      unit = 'year';
    } else if (diff.months) {
      quantity = diff.months;
      unit = 'month';
    } else if (diff.days) {
      quantity = diff.days;
      unit = 'day';
    } else if (diff.hours) {
      quantity = diff.hours;
      unit = 'hour';
    } else if (diff.minutes) {
      quantity = diff.minutes;
      unit = 'minute';
    } else if (diff.seconds) {
      quantity = diff.seconds;
      unit = 'second';
    }

    return i18n.t(
      'timeAgo',
      {
        quantity,
        unit: i18n.tc(unit, quantity <= 1 ? 1 : 2).toLowerCase(),
      },
    );
  };
  Vue.prototype.$dateFromNow = dateFromNow;
};
