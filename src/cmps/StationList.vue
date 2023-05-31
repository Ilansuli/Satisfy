<template>
  <!-- <div class="background-color-transition">
    height: 332px;
    margin-top: -64px;
    position: absolute;
    -webkit-transition: background 1s ease;
    transition: background 1s ease;
    width: 100%;
    z-index: -1;
    /* background-color: rgb(248, 224, 40); */
    background-image: linear-gradient(rgba(0,0,0,.6) 0,#121212 100%),url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=);
    left: 0;
  </div> -->
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
    <RouterLink to="/station/6423e736d6a1082554c7b0a2" class="top-content">
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
    <RouterLink to="/station/642449f17a15edb9bc1cc997" class="top-content">
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
    <StationPreview v-for="station in defaultStations" :key="station._id" :station="station" />
  </ul>
</template>

<script>
import StationPreview from '../cmps/StationPreview.vue';
export default {
  name: 'StationList',
  props: {
    stations: Array,
    default: [],
  },
  data() {
    return {
      stationId: '',
    };
  },
  mounted() {
    this.$store.dispatch('setCurrColor', 'rgb(0,0,0)');
  },
  methods: {
    onRouterLiked(){
      if(!this.loggedinUser)return console.log('user is not loggedin')//TODO: ADD CONTINUE AS GUEST MODAL
      return this.$router.push('/liked')
    },
    goToClickedStation(stationTitle) {
      this.$store.dispatch('setHeaderColor', `rgba(28, 17, 56, ${1 - opacity})`);

      const station = this.stations.find(({ title }) => title === stationTitle);
      this.stationId = station._Id;
    },
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
    defaultStations() {
      return this.stations.filter((station) => !station.isAddedByUser).splice(5, 100);
    },
    greetings() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        return 'Good morning';
      } else if (hour >= 12 && hour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    },
  },
  created() {},
  components: {
    StationPreview,
  },
};
</script>

<style></style>
