// import { stompClient } from 'boot/stomp';
import { LocalStorage, uid } from 'quasar';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

function doSubscribe(context, args, interval, tries) {
  const stompClient = context.getters.getStompClient;
  if (tries <= 10
      && context.getters.getStompClient.connected
      && !context.getters.getSubscription(args.name)) {
    const subscription = stompClient.subscribe(
      args.destination,
      args.callback && typeof args.callback === 'function' ? resp => args.callback(resp, context) : null,
      args.headers,
    );
    context.commit('SUBSCRIBE', { name: args.name, subscription });

    if (args.afterSubscription && typeof args.afterSubscription === 'function') {
      args.afterSubscription(context);
    }
  } else if (tries > 5
      || context.getters.getSubscription(args.name)) {
    console.log(
      `%c Finish subscription for [${args.name}] in [${tries}] tries`,
      'color: #551a8b',
    );
    clearInterval(interval);
  }

  return tries + 1;
}

function stompSubscribe(context, args) {
  const stateSubscription = context.getters.getSubscription(args.name);

  if (stateSubscription) {
    context.commit('UNSUBSCRIBE', args.name);
  }

  let tries = 1;
  const interval = setInterval(() => {
    tries = doSubscribe(context, args, interval, tries);
  }, 1000);
  tries = doSubscribe(context, args, interval, tries);
}

function connectAndReconnect(context, connectionId, callbackAfterConnection) {
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
        (/* resp */) => {
        // const respHeaders = resp.headers;
          const subHeaders = headers;
          const { username } = context.rootState.auth.account;

          subHeaders.id = `${username}-search-cancel`;
          stompSubscribe(context, {
            name: 'searchCancel',
            destination: '/user/queue/search/cancel',
            subHeaders,
          });

          stompSubscribe(context, {
            name: 'error',
            destination: '/user/queue/error',
            callback: (error) => {
              console.error(error);
            },
            subHeaders,
          });

          if (callbackAfterConnection && typeof callbackAfterConnection === 'function') {
            callbackAfterConnection();
          }
        },
        (error) => {
          setTimeout(() => {
            if (connectionId === context.getters.getConnectionId) {
              connectAndReconnect(context, connectionId);
            }
          }, 10000);
          console.error(error);
        },
      );

      context.commit('SET_STOMP_CLIENT', stompClient);
    }
  }
}

function stompSend(context, args, tries = 0) {
  setTimeout(() => {
    const stompClient = context.getters.getStompClient;
    tries = (tries || 0) + 1;

    const payload = typeof args.body !== 'string' ? JSON.stringify(args.body) : args.body;

    if (stompClient && stompClient.connected) {
      stompClient.send(args.destination, payload, args.headers);
    } else if (tries < 5) {
      stompSend(context, args, tries);
    }
  }, 1500);
}

export async function connect(context, callbackAfterConnection) {
  context.commit('SET_CONNECTION_ID', uid());

  connectAndReconnect(context, context.getters.getConnectionId, callbackAfterConnection);
}

export function send(context, args) {
  stompSend(context, args);
}

export function subscribe(context, args) {
  stompSubscribe(context, args);
}

export function startSearch(context) {
  context.commit('START_SEARCH');
}

export function cancelSearch(context) {
  context.commit('CANCEL_SEARCH');
}

export function incrementSearchCounter(context) {
  context.commit('SET_SEARCH_COUNTER', context.getters.getSearch.counter += 1);
}

export function finishSearch(context) {
  context.commit('FINISH_SEARCH');
}

export function insertResult(context, receivedResult) {
  const { result } = context.getters.getSearch;
  receivedResult = receivedResult.filter(user => !result.some(r => r.id === user.id));
  const finalResult = result.concat(receivedResult);

  context.commit('SET_SEARCH_RESULT', finalResult);
}
