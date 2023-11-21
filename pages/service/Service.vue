<template>
  <view class="main-container">
    <h2>{{ serviceName }}</h2>

    <view class="service-info">
      <view>剩余次数: {{ remainingChances }}</view>
      <view>每次费用: {{ costPerService }} 元</view>
      <view>余额: {{ balance }} 元</view>
<!--      <button @click="showRechargeDialog = true" type="primary">充值</button>-->
    </view>
    <view>{{ serviceInfo.how_to_use ? serviceInfo.how_to_use : '请直接输入你想问的问题' }}</view>
    <view class="chat-container" v-loading="isLoading">
      <view class="chat-messages" ref="chatMessages">
        <view v-for="(message, index) in messages" :key="index">
          <p v-if="message.sender === 'user'">我: {{ message.content }}</p>
          <p v-else>{{ serviceInfo.description }}: {{ message.content }}</p>
        </view>
      </view>
<!--      <view class="scroll-to-bottom" v-show="showScrollToBottom" @click="scrollToBottom">-->
<!--        <i class="el-icon-arrow-down"></i>-->
<!--      </view>-->
      <view class="chat-input">
        <input
            type="textarea"
            v-model="inputMessage"
            placeholder="输入你的问题"
            @keyup.enter="sendMessage"
        ></input>
        <button @click="sendMessage" type="primary">发送</button>
      </view>
    </view>

    <!-- 充值对话框 -->
<!--    <u-modal v-model="showRechargeDialog" title="充值" @close="resetRechargeAmount">-->
<!--      <view>-->
<!--        <input-->
<!--            v-model.number="rechargeAmount"-->
<!--            placeholder="输入充值金额"-->
<!--            type="number"-->
<!--        ></input>-->
<!--      </view>-->
<!--      <template v-slot:footer>-->
<!--        <button @click="showRechargeDialog = false">取 消</button>-->
<!--        <button type="primary" @click="recharge">确 定</button>-->
<!--      </template>-->
<!--    </u-modal>-->
  </view>
</template>

<script>
export default {
  data() {
    return {
      serviceName: '算命服务',
      remainingChances: 10,
      costPerService: 5,
      balance: 100,
      inputMessage: '',
      messages: [],
      showRechargeDialog: false,
      rechargeAmount: 0,
      serviceId: 0,
      serviceInfo: {},
      messageGroupId: null,
      isLoading: false,
      routeQuery: {},
    };
  },
  onLoad(options) {
    this.routeQuery = options;
    this.serviceId = this.routeQuery.id;
  },
  mounted() {
    // this.$commonUtils.updateMetaInfo(this.$route.meta.metaInfo);
    this.getServiceInfo();
    this.$nextTick(() => {
      this.$refs.chatMessages.addEventListener('scroll', this.handleScroll);
    });
  },
  beforeUnmount() {
    this.$refs.chatMessages.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage) return;

      // 将用户的消息添加到消息列表
      this.messages.push({ sender: 'user', content: this.inputMessage });

      // 将消息发送到服务器并获取回复
      const response = await this.fetchReply(this.inputMessage);
      this.messages.push({ sender: 'server', content: response });

      // 清空输入框
      this.inputMessage = '';

      // 滚动到底部
      this.scrollToBottom();
    },

    handleScroll() {
      const chatMessages = this.$refs.chatMessages;
      const scrollHeight = chatMessages.scrollHeight;
      const scrollTop = chatMessages.scrollTop;
      const clientHeight = chatMessages.clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      this.showScrollToBottom = !isAtBottom;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    },

    async fetchReply(message) {
      this.isLoading = true;
      // 发送消息到服务器并获取回复
      let resMsg = await this.$api.webapp.message.send_message({
        service_id: this.serviceId,
        message: message,
        message_group_id: this.messageGroupId,
      });
      this.isLoading = false;
      if (resMsg.code != 0) {
        this.$message.error('Failed to send message.');
        return;
      }
      let data = resMsg.data;
      this.messageGroupId = data.message_group_id;
      this.getServiceInfo();
      return data.response;
    },

    async recharge() {
      // 在这里添加充值逻辑
      let res = await this.$api.webapp.pay.create_pay_order({
        amount: this.rechargeAmount,
        service_id: this.serviceId,
        pay_type: 'alipayxp'
      });
      if (res.code !== 0 || !res.data?.pay_url) {
        this.$message.error('Failed to create pay order.');
        return;
      }
      window.location.href = res.data.pay_url;
      // this.balance += this.rechargeAmount;
      this.showRechargeDialog = false;
      // this.getServiceInfo();
    },

    resetRechargeAmount() {
      this.getServiceInfo();
    },

    //获取服务信息
    async getServiceInfo() {
      try {
        let resUserInfo = await this.$api.webapp.user.get_user_info();
        console.log(resUserInfo);
        if (resUserInfo.code !== 0) {
          this.$message.error('Failed to fetch user info.');
          return;
        }
        let userInfo = resUserInfo.data;
        console.log(userInfo.transactions, this.serviceId)
        let transaction = userInfo.transactions.find((transaction) => transaction.service_id == this.serviceId);
        console.log(transaction);

        if (transaction) {
          this.balance = transaction.amount;
        } else {
          this.balance = 0;
        }
        let service = transaction.service;
        this.serviceInfo = service;
        this.serviceName = service.name;
        this.costPerService = service.price;
        this.remainingChances = Number.parseInt(this.balance / this.costPerService);

      } catch (error) {
        this.$message.error('Failed to fetch service info.' + error);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 20px;
}

.service-info {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  view {
    margin: auto;
  }
}

.chat-container {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 4px;
  max-width: 80vw;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  height: calc(100vh - 400px);
  overflow-y: auto;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  padding: 5px;
  flex-grow: 1;
}

.scroll-to-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #f2f2f2;
  border-radius: 20px;
  position: absolute;
  right: 20px;
  bottom: 70px;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
}

.chat-input {
  display: flex;
  align-items: center;
}

.chat-input > .input {
  flex: 1;
  margin-right: 10px;
}

.el-dialog {
  max-width: 400px;
}
</style>
