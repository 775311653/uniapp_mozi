<template>
  <view class="services-container">
    <uni-card v-for="service in services" :key="service.id" @click="selectService(service)"
              class="cardItem"
              :title="service.name" :extra="service.extra" shadow>
      <text class="service-description">{{ service.description }}</text>
    </uni-card>
  </view>
</template>


<script>

import uniCard from '@dcloudio/uni-ui/lib/uni-card/uni-card.vue';


export default {
  data() {
    return {
      services: [],
    };
  },
  components: {
    uniCard,
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
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20rpx; /* 根据需要添加内边距 */

  .cardItem {
    width: 600rpx; /* 卡片宽度 */
    margin: 20rpx; /* 卡片间距 */

    .service-description {
      font-size: 28rpx;
      color: #666; /* 描述文字颜色 */
    }
  }
}

</style>

