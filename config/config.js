// 小程序没有地方可以配置环境变量，所以只能在这里配置了
let isProEnv = true;
let config = {
  url: {
    baseUrl: isProEnv ? 'https://api.hemozi.com' : 'http://192.168.2.115:3020',
  },
  // designWidth: 375, // 设计稿的宽度 写了这个后，就能使用 px(375)表示屏幕宽度了，就能按照设计稿的尺寸来写样式了
}

module.exports = config;
