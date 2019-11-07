import Vue from 'vue';
import { LocalStorage } from 'quasar';

const getStompHeaders = () => ({
  Authorization: String(LocalStorage.getItem('accessToken')),
});

Vue.prototype.$getStompHeaders = getStompHeaders;

export { getStompHeaders };
