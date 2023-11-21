import base from '../base';
import axios from '../../request/http';

const user = {
  // 获取用户信息
  get_user_info(params) {
    return axios.get(`${base.dev}/webapp/user/get_user_info`, { params });
  }
};

export default user;
