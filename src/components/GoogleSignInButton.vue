<template>
  <div>
    <div id="google-sign-in-button"></div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'

export default {
  name: 'GoogleSignInButton',
  methods: {
    handleToken(googleResponse){
      const { sub, name ,email, picture } = jwt_decode(googleResponse.credential)
      const userInfo = {
        id: sub,
        name,
        email,
        avatar: picture
      }
      this.$store.dispatch('postUser', userInfo)
    }
  },
  mounted(){
    window.google.accounts.id.initialize({
      client_id:
        '326616019329-u0hi8ovuvnohflrk2bpgju6v4u4bp0ct.apps.googleusercontent.com',
      callback: this.handleToken
    })

    window.google.accounts.id.renderButton(
      document.getElementById("google-sign-in-button"),
      { theme: "outline", size: "large" }
    )
  },
};
</script>