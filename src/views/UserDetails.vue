<template>
  <section class="user-details" v-if="user">
    <h1>{{ user.fullname }}'s Profile</h1>

    <div class="edit-modal-img">
      <article class="choose-photo">
        <div class="pencil-icon" v-html="getSvg('pencil')"></div>
        <span>Choose Photo</span>
        <ImgUploader @updateImgUrl="updateImgUrl" />
      </article>

      <div class="img-container">
        <img v-if="user.imgUrl" ref="image" :src="user.imgUrl" alt="" crossorigin="anonymous" />
        <img v-else
          src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683826469/WhatsApp_Image_2023-05-11_at_20.32.48_ybb9ov.jpg" />
      </div>
    </div>
    <!-- <img style="max-width: 200px; border-radius: 50%;" :src="user.imgUrl" /> -->
    <h3>Nickname - {{ user.username }}</h3>

    <button class="logout-btn" @click="doLogout">Logout</button>

  </section>
</template>
<script>
import ImgUploader from '../cmps/ImgUploader.vue'
import { svgService } from '../services/svg.service'
export default {

  watch: {
    userId: {
      handler() {
        if (this.userId) {
          this.$store.dispatch({ type: "loadAndWatchUser", userId: this.userId })
        }
      },
      immediate: true,
    },
  },
  computed: {
    user() {
      return this.$store.getters.watchedUser
    },
    userId() {
      return this.$route.params.id
    },
    isMe() {
      return this.userId === this.$store.getters.loggedinUser._id
    },
  },
  methods: {
    doLogout() {
      this.$store.dispatch({ type: 'logout' });
      this.$router.push('/');
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    updateImgUrl(imgUrl) {
      if (!imgUrl) return;
      this.user.imgUrl = imgUrl;
      this.$store.dispatch({ type: 'updateUser', user: this.user });
    },
  },
  components: {
    ImgUploader
  }
}
</script>