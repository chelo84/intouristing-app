import { LocalStorage } from 'quasar';
import jwt from 'jsonwebtoken';

export function login(state) {
  let { account } = state;

  const accessToken = String(LocalStorage.getItem('accessToken')).replace('Bearer ', '');
  account = jwt.decode(accessToken);
  if (account) {
    state.account = account;
    state.loggedIn = true;
  }
}
