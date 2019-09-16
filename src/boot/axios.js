import axios from 'axios';
import { LocalStorage } from 'quasar';
import { i18n } from './i18n';

export default async ({ Vue }) => {
  axios.defaults.headers.common.Authorization = LocalStorage.getItem('accessToken');
  axios.defaults.baseURL = process.env.API_URL;
  axios.defaults.headers.common['Accept-Language'] = i18n.locale;

  Vue.prototype.$axios = axios;
};
