import base from '../base';
import axios from '../../request/http';

const auth = {
  login(params) {
    return axios.post(`${base.dev}/webapp/user/login`, params);
  },
  register(params) {
    return axios.post(`${base.dev}/webapp/user/register`, params);
  },
  uni_login(params) {
    return axios.post(`${base.dev}/webapp/user/uni_login`, params);
  }
};

export default auth;
