export default async ({ Vue }) => {
  const showErrorAlert = (message) => {
    Vue.prototype.$q.notify({
      color: 'negative',
      position: 'top',
      message,
      icon: 'report_problem',
    });
  };
  Vue.prototype.$errorAlert = showErrorAlert;

  const showInfoAlert = (message) => {
    Vue.prototype.$q.notify({
      color: 'info',
      position: 'top',
      message,
      icon: 'info',
    });
  };
  Vue.prototype.$infoAlert = showInfoAlert;

  const showWarningAlert = (message) => {
    Vue.prototype.$q.notify({
      color: 'warning',
      position: 'top',
      message,
      icon: 'priority_high',
    });
  };
  Vue.prototype.$warningAlert = showWarningAlert;
};
