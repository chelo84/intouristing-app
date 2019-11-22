export function sendMessage(context, message) {
  context.commit('SEND_MESSAGE', message);
}

export function deleteSentMessage(context, messageHash) {
  context.commit('DELETE_SENT_MESSAGE', messageHash);
}
