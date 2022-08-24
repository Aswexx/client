<template>
  <div class="comment">
    <img class="comment__avatar" :src="comment.author.avatar.url" />

    <div class="comment__contents">
      <span class="comment__title">
        <b>{{ comment.author.name }}</b>
        {{ comment.author.alias }}
      </span>
      <p>
        回覆
        <router-link :to="{ name: 'posts', params: { userId: postAuthor.id } }"
          >@{{ postAuthor.alias }}</router-link
        >
      </p>
      <div>{{ comment.contents }}</div>
      <template v-if="comment.media">
        <img
          v-if="comment.media.type !== 'video/mp4'"
          :src="comment.media.url"
        />
        <video
          v-else
          autoplay
          :src="comment.media.url"
          @click="togglePlay" 
        ></video>
      </template>
      <!-- <video controls autoplay loop
        v-if="comment.image.url"
        :src="comment.image.url"
      >
      </video> -->
    </div>

    <div class="comment__interact">
      <a @click.stop="post;">
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"
          ></use>
        </svg>
        <span>1</span>
      </a>
      <a>
        <svg v-if="!isLike">
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-heart-normal"
          ></use>
        </svg>
        <svg class="heart-icon" v-else>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-heart-solid"
          ></use>
        </svg>
        <span>1</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  data() {
    return {
      isLike: false
    }
  },
  props: {
    comment: {
      type: Object
    },
    postAuthor: {
      type: Object
    }
  },
  methods: {
    togglePlay(event) {
      const video = event.target
      console.log(video)
      if (video.paused || video.ended) {
        video.play()
      } else {
        video.pause()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';

.comment {
  border-bottom: 1px solid $color-gray-400;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-column-gap: 1.5rem;
  grid-row-gap: 1rem;

  &__title {
    display: inline-block;
    padding-bottom: 0.5rem;
  }
}

.comment__interact {
  grid-column: 2/3;
  width: 30%;
  display: flex;
  justify-content: space-between;
  svg {
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 1rem;
  }
}
</style>