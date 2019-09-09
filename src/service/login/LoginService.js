import axios from 'axios';

export default class LoginService {
  axios = axios;

  list() {
    return this.axios.get('/my/api/endpoint');
  }
}
