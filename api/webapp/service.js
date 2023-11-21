import base from '../base';
import axios from '../../request/http';

const service = {
  // 获取service列表
  get_services(params) {
    return axios.get(`${base.dev}/webapp/service/get_services`, { params });
  },
  // 获取单个service
  get_service_by_id(params) {
    return axios.get(`${base.dev}/webapp/service/get_service_by_id`, { params });
  }
};

export default service;
