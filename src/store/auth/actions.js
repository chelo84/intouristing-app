export function checkAuth(context) {
  const account = context.getters['auth/getAccount'];

  if (!account) {
    context.commit('login');
  }
}

export function logout(context) {
  context.commit('logout');
  context.rootState.stomp.stompClient.disconnect(() => console.log('WebSocket disconnected'));
}
