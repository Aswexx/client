<template>
  <div>
    <PageInfoBar/>
    <div class="card-container">
      <div class="card" v-if="!$store.getters.loginedUser.isSponsor">
        <div class="title">成為贊助會員</div>

        <div class="icon-medal">
          <img class="medal" src="./../assets/images/medal.svg" />
        </div>

        <h3>$10 TWD</h3>

        <div class="features">
          <ul>
            <li>提高用戶列表顯示優先度</li>
            <li>保留所有聊天紀錄</li>
            <li>未來不定期新增功能等等..</li>
            <li>一次贊助永久有效</li>
          </ul>
        </div>

        <button class="btn" @click="startPay">決定贊助</button>
      </div>

      <div class="card" v-else>
        <div class="title">您已是贊助會員</div>

        <div class="icon-medal">
          <img class="medal" src="./../assets/images/medal.svg" />
        </div>

        <div class="features">
          <h3>目前已開通</h3>
          <ul>
            <li>用戶列表顯示優先度提升</li>
            <li>保留所有聊天紀錄</li>
            <li>未來不定期新增功能等等..</li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import PageInfoBar from './../components/PageInfoBar.vue'
export default {
  name:'SponsorPage',
  components: { PageInfoBar },
  methods: {
    async startPay(){
      const result = await this.$axios.post(`${this.$API_URL}/users/sponsor`, { userId: this.$store.getters.loginedUserId })
      const linePay = result.data.linePay
      const linePayWindow = window.open(linePay)
      const notificationSocket = this.$store.state.notifSocket
      const updateSponsorState = () => {
        setTimeout(()=> {
          linePayWindow.close()
        }, 5000)
        this.$store.commit('userAbout/UPDATE_SPONSOR_STATE')
        notificationSocket.off('paid', updateSponsorState)
      }
      notificationSocket.on('paid', updateSponsorState)
    },
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  display: flex;
  justify-content: center;
}

.card {
  margin-top: 3rem;
  background: salmon;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.4);
  border-radius: 1rem;
  width: 50%;
  padding: 2rem;
  text-align: center;
  color: white;
  .title {
    font-size: 25px;
  }
  .icon-medal {
    margin: 3rem 0;

    img {
      width: 7rem;
      height: 7rem;
    }
  }
  .features {
    ul {
      padding: 0;
      margin: 20px 0 50px 0;
      list-style-type: none;
      li {
        margin: 10px 0;
        font-size: 14px;
      }
    }
  }
  .btn {
    display: inline-block;
    background: skyblue;
    color: white;
    padding: 15px 20px;
    margin: 15px 0;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.9);
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    &:hover {
      background: goldenrod;
    }
  }
}
</style>