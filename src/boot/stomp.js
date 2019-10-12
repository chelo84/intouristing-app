// // import something here
// import SockJS from 'sockjs-client';
// import Stomp from 'webstomp-client';
// import Vue from 'vue';
// // import { LocalStorage } from 'quasar';
// // import store from '../store';


// // "async" is optional
// const socket = new SockJS(`${process.env.API_URL}sockjs`);
// const stompClient = Stomp.over(socket);

// // const headers = {
// //   Authorization: LocalStorage.getItem('accessToken'),
// // };

// // const socket = new SockJS(`${process.env.API_URL}sockjs`);
// // stompClient.over(socket);
// // stompClient.connect(
// //   headers,
// //   (resp) => {
// //     // const respHeaders = resp.headers;
// //     console.log(resp.headers);
// //     const subHeaders = headers;
// //     const { username } = store().getters['auth/getAccount'];

// //     console.log(username);

// //     subHeaders.id = `${username}-search-cancel`;
// //     stompClient.subscribe(
// //       '/user/queue/search/cancel',
// //       (message) => {
// //         console.log('/search/cancel');
// //         console.log(message);
// //       },
// //       subHeaders,
// //     );

// //     subHeaders.id = `${username}-error`;
// //     stompClient.subscribe(
// //       '/user/queue/error',
// //       (error) => {
// //         console.log('/error');
// //         console.log(error);
// //       },
// //       subHeaders,
// //     );
// //   },
// //   (error) => {
// //     console.log(error);
// //     if (error && typeof error === 'object') {
// //       console.error(error.headers ? error.headers.message : 'Something went wrong');
// //     }
// //   },
// // );

// Vue.prototype.$stompClient = stompClient;

// export { stompClient };
