import { LocalStorage } from 'quasar';
import jwt from 'jsonwebtoken';

export function checkAuth(context) {
  const account = context.getters.getAccount;
  const accessToken = LocalStorage.getItem('accessToken');
  const expDate = accessToken ? jwt.decode(accessToken.replace('Bearer ', '')).exp : null;
  const tokenIsExpired = expDate && expDate < Date.now() / 1000;
  /*
   * If account is null and the token is not expired, try to log-in
   * And if account is not null but the token is expired, log-out
   */
  if (!account && !tokenIsExpired) {
    context.commit('login');
  } else if (account && tokenIsExpired) {
    context.commit('logout');
  }
}

export function logout(context) {
  context.commit('logout');
  context.rootState.stomp.stompClient.disconnect(() => console.debug('WebSocket disconnected'));
}
