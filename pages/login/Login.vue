<template>
  <view class="container">
    <button @click="onWechatLogin">微信登录</button>
  </view>
</template>


<script>

export default {
  name: "Login",
  methods: {
    onWechatLogin() {
      // 调用微信登录
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          // 获取code
          const code = loginRes.code;
          console.log('code', code);
          // 调用服务端API，传递code
          let resUniLogin = await this.$api.webapp.auth.uni_login({ code, type: 'wx' });
          // console.log('resUniLogin', resUniLogin);
          if (resUniLogin.code !== 0) {
            uni.showToast({
              title: '登录失败',
              icon: 'none',
            });
            return;
          }
          this.$store.commit('set', { key: 'user', value: resUniLogin.data.user });
          this.$store.commit('set', { key: 'token', value: resUniLogin.data.token });
          uni.showToast({
            title: '登录成功',
            icon: 'none',
          });
          uni.navigateTo({
            url: '/pages/selectServices/SelectService',
          })
        },
        fail: (err) => {
          console.error('微信登录失败', err);
        }
      });
    },
  }
}
</script>


<style scoped lang="scss">
.container {
  // 添加您的样式
  button {
    // 按钮样式
  }
}
</style>

