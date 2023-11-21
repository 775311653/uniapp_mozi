import base from '../base';
import axios from '../../request/http';

const message = {
  // send_message
  send_message(params) {
    return axios.post(`${base.dev}/webapp/message/send_message`, params, {
      timeout: 1000 * 60 * 5,
    });
  }
};

export default message;
