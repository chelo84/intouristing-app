import { stompClient } from 'boot/stomp';
import { LocalStorage } from 'quasar';

export function connect(context) {
  const accessToken = LocalStorage.getItem('accessToken');

  if (accessToken) {
    const headers = {
      Authorization: accessToken,
    };

    stompClient.connect(
      headers,
      (resp) => {
      // const respHeaders = resp.headers;
        console.log(resp.headers);
        const subHeaders = headers;
        const { username } = context.getters['auth/getAccount'];

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
        if (error && typeof error === 'object') {
          console.error(error.headers ? error.headers.message : 'Something went wrong');
        }
      },
    );
  }
}
