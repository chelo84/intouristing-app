import axios from 'axios';
import { LocalStorage } from 'quasar';

export default async ({ Vue }) => {
  axios.defaults.headers.common.Authorization = LocalStorage.getItem('accessToken');
  axios.defaults.baseURL = process.env.API_URL;

  Vue.prototype.$axios = axios;
};
