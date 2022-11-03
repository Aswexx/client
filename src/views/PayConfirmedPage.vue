<template>
  <div class="container">
    <img class="brand-logo" src="./../assets/images/logo.svg">
    <h3>支付完成，感謝贊助!</h3>
    <p>此分頁將在{{ seconds }}秒內自動關閉</p>
  </div>
</template>

<script>
export default {
  name: 'PayConfirmedPage',
  data(){
    return {
      seconds: 5
    }
  },
  mounted(){
    const cb = () => {
      this.seconds -= 1
      if (this.seconds <= 0) {
        clearInterval(timer)
      }
    }
    const timer = setInterval(cb, 1000)
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 6rem;
  height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.brand-logo {
  width: 10rem;
  height: 7.5rem;
}
</style>