import { date } from 'quasar';
import { i18n } from './i18n';

export default async ({ Vue }) => {
  const toDistance = distance => (Math.abs(distance) > 999
    ? `${Math.sign(distance) * ((Math.abs(distance) / 1000).toFixed(1))}km`
    : `${Math.sign(distance) * Math.abs(distance)}m`);

  const dateInternatiolization = {
    days: [
      i18n.t('sunday'),
      i18n.t('monday'),
      i18n.t('tuesday'),
      i18n.t('wednesday'),
      i18n.t('thursday'),
      i18n.t('friday'),
      i18n.t('saturday'),
    ],
    daysShort: [
      i18n.t('sundayShort'),
      i18n.t('mondayShort'),
      i18n.t('tuesdayShort'),
      i18n.t('wednesdayShort'),
      i18n.t('thursdayShort'),
      i18n.t('fridayShort'),
      i18n.t('saturdayShort'),
    ],
    months: [
      i18n.t('january'),
      i18n.t('february'),
      i18n.t('march'),
      i18n.t('april'),
      i18n.t('may'),
      i18n.t('june'),
      i18n.t('july'),
      i18n.t('august'),
      i18n.t('september'),
      i18n.t('october'),
      i18n.t('november'),
      i18n.t('december'),
    ],
    monthsShort: [
      i18n.t('januaryShort'),
      i18n.t('februaryShort'),
      i18n.t('marchShort'),
      i18n.t('aprilShort'),
      i18n.t('mayShort'),
      i18n.t('juneShort'),
      i18n.t('julyShort'),
      i18n.t('augustShort'),
      i18n.t('septemberShort'),
      i18n.t('octoberShort'),
      i18n.t('novemberShort'),
      i18n.t('decemberShort'),
    ],
  };

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
      // TODO check why this is returning one hour forward
      quantity = diff.hours;
      unit = 'hour';
    } else if (diff.minutes) {
      quantity = diff.minutes;
      unit = 'minute';
    } else if (diff.seconds) {
      quantity = diff.seconds;
      unit = 'second';
    }

    let message;
    if (!quantity || quantity === 0) {
      message = i18n.t('justNow');
    } else if (quantity > 0) {
      message = i18n.t(
        'timeAgo',
        {
          quantity,
          unit: i18n.tc(unit, quantity <= 1 ? 1 : 2).toLowerCase(),
        },
      );
    } else if (quantity < 0) {
      quantity *= -1;
      message = i18n.t(
        'timeIn',
        {
          quantity,
          unit: i18n.tc(unit, quantity > -1 ? 1 : 2).toLowerCase(),
        },
      );
    }

    return message;
  };
  Vue.prototype.$dateFromNow = dateFromNow;


  const formatDate = (dt, format) => date.formatDate(dt, format, dateInternatiolization);
  Vue.prototype.$formatDate = formatDate;
};
