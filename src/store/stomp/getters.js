export function getStompClient(state) {
  return state.stompClient;
}

export function getConnectionId(state) {
  return state.connectionId;
}

export function getSearch(state) {
  return state.search;
}

export function getSubscriptions(state) {
  return state.subscriptions;
}

export function getSubscription(state) {
  return subscriptionName => state.subscriptions
    .find(subscription => subscription.name === subscriptionName);
}
