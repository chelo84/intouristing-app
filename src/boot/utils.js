export default async ({ Vue }) => {
  const toDistance = distance => (Math.abs(distance) > 999
    ? `${Math.sign(distance) * ((Math.abs(distance) / 1000).toFixed(1))}km`
    : `${Math.sign(distance) * Math.abs(distance)}m`);

  Vue.prototype.$toDistance = toDistance;
};
