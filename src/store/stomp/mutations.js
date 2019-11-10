export function SET_STOMP_CLIENT(state, stompClient) {
  state.stompClient = stompClient;
}

export function SET_CONNECTION_ID(state, connectionId) {
  state.connectionId = connectionId;
}

export function SUBSCRIBE(state, subscription) {
  if (!state.subscriptions.some(sub => sub.name === subscription.name)) {
    state.subscriptions.push(subscription);
  }
}

export function UNSUBSCRIBE(state, subscription) {
  const index = state.subscriptions.findIndex(sub => sub.name === subscription.name);
  if (index !== 1) {
    state.subscriptions.splice(index, 1);
  }
}

export function START_SEARCH(state) {
  state.search = {
    counter: 1,
    finished: false,
    cancelled: false,
    result: [],
  };
}

export function CANCEL_SEARCH(state) {
  state.search.cancelled = true;
}

export function FINISH_SEARCH(state) {
  state.search.finished = true;
}

export function SET_SEARCH_COUNTER(state, count) {
  state.search.counter = count;
}

export function SET_SEARCH_RESULT(state, result) {
  state.search.result = result;
}
