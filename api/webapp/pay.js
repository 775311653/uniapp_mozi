import base from '../base';
import axios from '../../request/http';

const pay = {
  // create_pay_order
  create_pay_order(params) {
    return axios.post(`${base.dev}/webapp/pay/create_pay_order`, params);
  },
  // 获取支付订单
  get_pay_order(params) {
    return axios.get(`${base.dev}/webapp/pay/get_pay_order`, { params });
  }
};

export default pay;
