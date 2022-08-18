<template>
  <div>
    <span>{{ comment.contents }}</span>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object
    }
  },
  mounted(){
    
  }
}
</script>

<style lang="sass" scoped>

</style>