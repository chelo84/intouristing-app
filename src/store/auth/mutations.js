import { LocalStorage } from 'quasar';
import jwt from 'jsonwebtoken';

export function login(state) {
  let { account } = state;

  const accessToken = String(LocalStorage.getItem('accessToken'));
  account = accessToken ? jwt.decode(accessToken.replace('Bearer ', '')) : null;
  if (account) {
    state.account = account;
    state.loggedIn = true;
  }
}

export function logout(state) {
  LocalStorage.remove('accessToken');
  state.account = null;
  state.loggedIn = false;
}
