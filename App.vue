<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
      this.onWechatLogin();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
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
            let pages = getCurrentPages(); // 获取当前页面栈
            let currentPage = pages[pages.length - 1]; // 获取最后一个页面，即当前页面
            currentPage.onShow(); // 执行目标页面的onShow方法,用于刷新页面数据

            // uni.navigateTo({
            //   url: '/pages/selectServices/SelectService',
            // })
          },
          fail: (err) => {
            console.error('微信登录失败', err);
          }
        });
      },
    },
	}
</script>

<style>
	/*每个页面公共css */
</style>
