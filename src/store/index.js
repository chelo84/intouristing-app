import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import stomp from './stomp';
import chat from './chat';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      stomp,
      chat,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: false,
  });

  return Store;
}
