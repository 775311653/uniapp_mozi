<template>
  <view class="services-container">
    <view v-for="service in services" :key="service.id" class="service-card" @click="selectService(service)">
      <text class="service-title">{{ service.name }}</text>
      <text class="service-description">{{ service.description }}</text>
    </view>
  </view>
</template>


<script>

export default {
  data() {
    return {
      services: [],
    };
  },
  mounted() {
    console.log('onMounted');
    this.fetchServices();
  },
  created() {
    console.log('onCreated');
    // await this.fetchServices();
  },
  methods: {
    async fetchServices() {
      try {
        const res = await this.$api.webapp.service.get_services();
        if (res.code !== 0) {
          uni.showToast({ title: 'Failed to fetch services.', icon: 'none' });
          return;
        }
        this.services = res.data;
      } catch (error) {
        uni.showToast({ title: 'Failed to fetch services.', icon: 'none' });
      }
    },
    selectService(service) {
      uni.navigateTo({ url: `/pages/service/service?id=${service.id}` }); // 修改为 UniApp 路由跳转方式
    },
  },
};
</script>

<style scoped lang="scss">
.services-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.service-card {
  width: 600rpx; /* 调整宽度为适合移动端的尺寸 */
  margin: 40rpx;
  cursor: pointer;
}

.service-title {
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.service-description {
  font-size: 28rpx;
}
</style>

