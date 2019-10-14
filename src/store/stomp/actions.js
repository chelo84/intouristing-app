// import { stompClient } from 'boot/stomp';
import { LocalStorage, uid } from 'quasar';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

function connectAndReconnect(context, connectionId) {
  const accessToken = LocalStorage.getItem('accessToken');
  if (accessToken) {
    let stompClient = context.getters['stomp/getStompClient'];
    if (!stompClient || (stompClient && !stompClient.connected)) {
      const headers = {
        Authorization: accessToken,
      };

      const socket = new SockJS(`${process.env.API_URL}sockjs`);
      stompClient = Stomp.over(socket, { debug: false });

      stompClient.connect(
        headers,
        (resp) => {
        // const respHeaders = resp.headers;
          console.log(resp.headers);
          const subHeaders = headers;
          const { username } = context.rootState.auth.account;

          subHeaders.id = `${username}-search-cancel`;
          stompClient.subscribe(
            '/user/queue/search/cancel',
            (message) => {
              console.log('/search/cancel');
              console.log(message);
            },
            subHeaders,
          );

          subHeaders.id = `${username}-error`;
          stompClient.subscribe(
            '/user/queue/error',
            (error) => {
              console.log('/error');
              console.log(error);
            },
            subHeaders,
          );
        },
        (error) => {
          console.error(error);

          setTimeout(() => {
            if (connectionId === context.getters.getConnectionId) {
              connectAndReconnect(context, connectionId);
            }
          }, 5000);
          // if (error && typeof error === 'object') {
          // console.error(error.headers ? error.headers.message : 'Something went wrong');
          // }
        },
      );

      context.commit('SET_STOMP_CLIENT', stompClient);
    }
  }
}

export async function connect(context) {
  console.log('stomp/connect');

  context.commit('SET_CONNECTION_ID', uid());

  connectAndReconnect(context, context.getters.getConnectionId);
}
