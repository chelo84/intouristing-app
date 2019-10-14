import { LocalStorage } from 'quasar';

export function getStompClient(state) {
  return state.stompClient;
}

export function getHeaders() {
  return {
    Authorization: LocalStorage.getItem('accessToken'),
  };
}

export function getConnectionId(state) {
  return state.connectionId;
}
