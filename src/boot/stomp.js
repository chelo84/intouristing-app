// import something here
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import Vue from 'vue';


// "async" is optional
const socket = new SockJS(`${process.env.API_URL}sockjs`);
const stompClient = Stomp.over(socket);

Vue.prototype.$stompClient = stompClient;

export { stompClient };
