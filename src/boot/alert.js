export default async ({ Vue }) => {
  const showAlert = (opt) => {
    Vue.prototype.$q.notify({
      color: opt.color || 'info',
      position: opt.position || 'top',
      message: opt.message || '',
      icon: opt.icon || '',
    });
  };

  const showErrorAlert = (message, opt) => {
    showAlert({
      color: 'negative',
      position: opt ? opt.position : null,
      message,
      icon: 'report_problem',
    });
  };
  Vue.prototype.$errorAlert = showErrorAlert;

  const showInfoAlert = (message, opt) => {
    showAlert({
      color: 'info',
      position: opt ? opt.position : null,
      message,
      icon: 'info',
    });
  };
  Vue.prototype.$infoAlert = showInfoAlert;

  const showWarningAlert = (message, opt) => {
    showAlert({
      color: 'warning',
      position: opt ? opt.position : null,
      message,
      icon: 'priority_high',
    });
  };
  Vue.prototype.$warningAlert = showWarningAlert;

  const showSuccessAlert = (message, opt) => {
    showAlert({
      color: 'positive',
      position: opt ? opt.position : null,
      message,
      icon: 'priority_high',
    });
  };
  Vue.prototype.$successAlert = showSuccessAlert;
};
