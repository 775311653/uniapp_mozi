import axios from 'axios';
import store from '../store';

const tip = msg => {
  uni.showToast({ title: msg, icon: 'none' });
};

/**
 * @param {Number} status
 */
const errorHandle = (status, data) => {
  switch (status) {
    case 401:
      break;
    case 403:
      break;
    case 404:
      tip('请求的资源不存在');
      break;
    case 500:
      tip(data);
      break;
    default:
  }
};

// 请求拦截器
function requestInterceptor(config) {
  // 这里可以添加请求前的处理逻辑
  // 例如添加 token、设置头部信息等
  const token = store.state.token;
  const userid = store.state.userId;
  config.header = {
    ...config.header,
    Authorization: `Bearer ${token}`,
  };
  userid && (config.header.userid = userid);


  return config;
}

// 响应拦截器
function responseInterceptor(response) {
  // 这里可以添加响应后的处理逻辑
  // 例如处理统一的错误信息、格式化返回数据等
  if (response.statusCode === 200) {
    return response.data;
  } else {
    // 处理错误
    if (response) {
      if (response.status == 401) {
        store.commit('set', { key: 'token', value: '' });
        uni.redirectTo({ url: '/pages/login/login' });
      } else {
        errorHandle(response.status, response.data.errors[0].message);
      }
    }
  }
}

// 发送请求
function request(options) {
  // options.url = this.baseUrl + options.url; // 拼接完整的 URL
  options = requestInterceptor(options); // 请求拦截

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (response) => {
        try {
          const result = responseInterceptor(response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

let instance = {
  get: function (url, data) {
    return request({
      url,
      data,
      method: 'GET'
    });
  },
  post: function (url, data) {
    return request({
      url,
      data,
      method: 'POST'
    });
  }
}


export default instance;
