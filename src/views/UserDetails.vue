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
        <img ref="image" :src="this.user.imgUrl" crossorigin="anonymous" />
      </div>
    </div>
    <h3>Nickname - {{ user.username }}</h3>

    <button class="logout-btn" @click="doLogout">Logout</button>
  </section>
</template>
<script>
import ImgUploader from "../cmps/ImgUploader.vue";
import { svgService } from "../services/svg.service";
import { userService } from "../services/user.service";

export default {
  data() {
    return {
      user: null,
    };
  },
  created() {},
  watch: {
    "$route.params": {
      async handler() {
        const { id } = this.$route.params;
        try {
          const user = await userService.getById(id);
          this.user = user;
        } catch (error) {
          console.log("Error fetching user: ", error);
        }
      },
      immediate: true,
    },
  },
  computed: {
    userId() {
      return this.$route.params.id;
    },
    isMe() {
      return this.userId === this.$store.getters.loggedinUser._id;
    },
  },
  methods: {
    doLogout() {
      this.$store.dispatch({ type: "logout" });
      this.$router.push("/");
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    updateImgUrl(imgUrl) {
      if (!imgUrl) return;
      this.user.imgUrl = imgUrl;
      this.$store.dispatch({ type: "updateUser", user: this.user });
    },
  },
  components: {
    ImgUploader,
  },
};
</script>
