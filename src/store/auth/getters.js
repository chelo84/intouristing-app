import state from './state';

export function getAccount() {
  const { account } = state;
  return account;
}
