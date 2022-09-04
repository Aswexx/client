<template>
  <div>
    <div id="google-sign-in-button"></div>
  </div>
</template>

<script>

export default {
  name: 'GoogleSignInButton',
  methods: {
    async handleToken(googleResponse) {
      await this.$store.dispatch('userAbout/googleOauth', googleResponse.credential)
      await this.$store.dispatch('userAbout/getPopUsers')
      await this.$store.dispatch('postAbout/getHomePagePosts')

      this.$router.push({ name: 'home' })
    }
  },
  mounted() {
    window.google.accounts.id.initialize({
      client_id:
        '326616019329-u0hi8ovuvnohflrk2bpgju6v4u4bp0ct.apps.googleusercontent.com',
      callback: this.handleToken
    })

    window.google.accounts.id.renderButton(
      document.getElementById('google-sign-in-button'),
      { theme: 'outline', size: 'large' }
    )
  }
}
</script>