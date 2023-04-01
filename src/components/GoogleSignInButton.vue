<template>
  <div id="google-sign-in-button"></div>
</template>

<script>

export default {
  name: 'GoogleSignInButton',
  methods: {
    async handleToken(googleResponse) {
      await this.$store.dispatch('userAbout/googleOauth', googleResponse.credential)
      await this.$store.dispatch('userAbout/getUsers')
      await this.$store.dispatch('postAbout/getHomePagePosts')

      this.$router.push({ name: 'home' })
    }
  },
  mounted() {
    window.google.accounts.id.initialize({
      client_id:
        `${process.env.VUE_APP_GOOGLE_ID}`,
      callback: this.handleToken
    })

    window.google.accounts.id.renderButton(
      document.getElementById('google-sign-in-button'),
      { theme: 'outline',
        size: 'medium',
        shape: 'circle',
        logo_alignment: 'center',
        width: 358,
      }
    )
  }
}
</script>

<style lang="scss" scoped>
</style>