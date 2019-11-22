export function SEND_MESSAGE(state, message) {
  state.sentMessages.push(message);
}

export function DELETE_SENT_MESSAGE(state, messageHash) {
  const index = state.sentMessages.findIndex(message => message.hash === messageHash);
  if (index !== -1) {
    state.sentMessages.splice(index, 1);
  }
}
