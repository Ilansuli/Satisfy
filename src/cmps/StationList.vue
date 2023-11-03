<template>
  <div>
    <h2 class="greeting">{{ greetings }}</h2>
    <section class="station-list-top-content-container">
      <button
        @mouseover="this.$store.dispatch('setCurrColor', 'rgb(28, 11, 59)')"
        @click="onRouterLiked"
        class="top-content"
      >
        <img
          class="top-content-img"
          src="https://res.cloudinary.com/dixcbkuih/image/upload/v1679553986/20_arpepb.png"
          alt=""
        />
        <!-- <div class="top-content-content-internal-wrapper"> -->
        <h1>Liked Songs</h1>
        <!-- </div> -->
      </button>
      <RouterLink to="/station/65423cc763378515d636a14a" class="top-content">
        <img
          class="top-content-img"
          src="https://res.cloudinary.com/dixcbkuih/image/upload/v1680351517/Michael_Jackson_n5zdz3.jpg"
          alt=""
        />
        <h1>Michael Jackson</h1>
      </RouterLink>
      <RouterLink to="/station/64230edcad4901b53baf3616" class="top-content">
        <img
          class="top-content-img"
          src="https://res.cloudinary.com/dixcbkuih/image/upload/v1679553985/18_pc62j8.jpg"
          alt=""
        />
        <h1>Jericho Jackson</h1>
      </RouterLink>
      <RouterLink to="/station/64298cb5b81c3093e0bd1aef" class="top-content">
        <img
          class="top-content-img"
          src="https://res.cloudinary.com/dixcbkuih/image/upload/v1680351679/Dennis_2_ck0cjn.jpg"
          alt=""
        />
        <h1>Dennis Lloyd</h1>
      </RouterLink>
      <RouterLink to="/station/64244ddb66db8ebc64929aec" class="top-content">
        <img
          class="top-content-img"
          src="https://res.cloudinary.com/dixcbkuih/image/upload/v1680100374/Bigggie_lz2get.jpg"
          alt=""
        />
        <h1>The Notorious B.I.G</h1>
      </RouterLink>
      <RouterLink to="/station/6424467cfe9a97782b5bc3c0" class="top-content">
        <img
          class="top-content-img"
          src="https://res.cloudinary.com/dixcbkuih/image/upload/v1680351763/Eminem_2_uqxudw.jpg"
          alt=""
        />
        <h1>Eminem</h1>
      </RouterLink>
    </section>

    <article>
      <h1 class="station-list-text">Made For You</h1>
    </article>
    <ul class="station-list">
      <StationPreview
        v-for="station in defaultStations"
        :key="station._id"
        :station="station"
      />
    </ul>
  </div>
</template>

<script>
import StationPreview from "../cmps/StationPreview.vue";
export default {
  name: "StationList",
  props: {
    stations: Array,
    default: [],
  },
  data() {
    return {
      stationId: "",
      isLoading: true,
    };
  },
  mounted() {
    this.$store.dispatch("setCurrColor", "rgb(0,0,0)");
  },
  methods: {
    onRouterLiked() {
      if (!this.loggedInUser) return this.$router.push("/login");
      return this.$router.push("/liked");
    },
    goToClickedStation(stationTitle) {
      this.$store.dispatch(
        "setHeaderColor",
        `rgba(28, 17, 56, ${1 - opacity})`
      );

      const station = this.stations.find(({ title }) => title === stationTitle);
      this.stationId = station._Id;
    },
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    labels() {
      return this.$store.getters.labels;
    },
    defaultStations() {
      return this.stations
        .filter((station) => !station.isAddedByUser)
        .splice(5, 100);
    },
    greetings() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        return "Good morning";
      } else if (hour >= 12 && hour < 18) {
        return "Good afternoon";
      } else {
        return "Good evening";
      }
    },
  },
  watch: {},
  created() {},
  components: {
    StationPreview,
  },
};
</script>

<style></style>
