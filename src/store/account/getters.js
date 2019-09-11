import { LocalStorage } from 'quasar';
import jwt from 'jsonwebtoken';
import state from './state';

export function getAccount() {
  let { account } = state;

  if (!account) {
    const accessToken = String(LocalStorage.getItem('accessToken')).replace('Bearer ', '');
    account = jwt.decode(accessToken);
    state.account = account;
  }

  return account;
}
