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
};
