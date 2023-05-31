<template>
  <header :style="{ backgroundColor: headerColor }" ref="header" class="header">
    <section class="header-buttons">
      <button title="Go Back" @click="goBack" class="header-btn header-nav-btn">
        <div class="icon" v-html="getSvg('arrowLeft')"></div>
      </button>
      <button title="Go Forward" @click="goForward" class="header-btn btn-next header-nav-btn">
        <div class="header-btn btn-prev icon" v-html="getSvg('arrowRight')"></div>
      </button>
    </section>
    <PlayBtn :style="{ opacity: 1 - this.$store.getters.opacity - 3 }" :station="currStation" v-if="showPlayBtn" />
    <span class="station-title" :style="{ opacity: 1 - this.$store.getters.opacity - 3 }" v-if="showPlayBtn">{{
      stationTitle }}</span>
    <SongSearch class="header-search" @setSearch="setSearch" v-if="isSearch" />
    <div v-else class="header-search-placeholder"></div>
    <!-- <SongSearchList class="station-details-search" @setFilter="setFilter" /> -->
    <section class="loggedin-user" v-if="loggedInUser">
      <div class="user-img-container" v-if="loggedInUser.imgUrl">
        <img class="header-img" :src="loggedInUser.imgUrl" />
      </div>

      <div v-else class="user-icon-container">
        <div class="user-icon" v-html="getSvg('user')"></div>
      </div>

      <RouterLink :to="`/user/${loggedInUser._id}`">
        {{ loggedInUser.username }}
      </RouterLink>

      <div class="arrow-down-icon-container">
        <div @click.stop="openUserOptions" class="arrow-down-icon" v-html="getSvg('arrowDownFill')"></div>
      </div>
      <ul v-if="isUserOptionsShown" class="user-options-menu">
        <li @click="doLogout">Logout</li>
      </ul>
    </section>

    <section v-else class="loginSignup">
      <div v-if="isShowSignUp" class="signup-btn">
        <RouterLink class="signup-span" to="/signup">Sign up</RouterLink>
      </div>
      <div v-if="isShowLogin" class="login-btn">
        <RouterLink class="login-span" to="/login">Log in</RouterLink>
      </div>
    </section>
  </header>
</template>

<script>
import { svgService } from '../services/svg.service.js';
import SongSearchList from './SongSearchList.vue';
import { stationService } from '../services/station.service.js';
import SongSearch from './SongSearch.vue';
import PlayBtn from './PlayBtn.vue';
export default {
  data() {
    return {
      isShowLogin: true,
      isShowSignUp: true,
      stationTitle: ''
    };
  },
  methods: {
    openUserOptions() {
      this.$store.commit({ type: 'openUserOptions' });
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    setFilter(filterBy) {
      this.$store.dispatch({ type: 'loadToys', filterBy });
    },
    goBack() {
      if (Object.keys(this.$route.query).length > 0 && this.$route.path === '/search') {
        this.$router.replace('/search');
      } else this.$router.go(-1);
    },
    goForward() {
      this.$router.go(+1);
    },
    setSearch(query) {
      if (this.isSearch) {
        // const url = new URL(window.location)
        // url.searchParams.set('query',query)
        this.$router.replace({ name: 'Search', query: { query } });
      }
    },
    doLogout() {
      this.$store.dispatch({ type: 'logout' });
      this.$router.push('/');
    },
  },
  computed: {
    currStation() {
      return this.$store.getters.currentStation;
    },
    showPlayBtn() {
      return this.$route.params.stationId;
    },
    isUserOptionsShown() {
      return this.$store.getters.isUserOptionsShown;
    },
    headerColor() {
      const opacity = 1 - this.$store.getters.opacity;
      return this.$store.getters.currColor.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
    },
    isFilterShown() {
      return this.$store.getters.isFilterShown;
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    isSearch() {
      if (this.$route.name === 'Search') return true;
      else return false;
    },
  },
  watch: {
    $route: {
      handler() {
        const { path } = this.$route;
        if (path === '/login') {
          this.isShowLogin = false;
          this.isShowSignUp = false;
        } else if (path === '/signup') {
          this.isShowLogin = true;
          this.isShowSignUp = false;
        } else {
          this.isShowLogin = true;
          this.isShowSignUp = true;
        }
      },
      immediate: true,
    },
    '$route.params': {
      async handler() {
        const { stationId } = this.$route.params;
        console.log('stationId', stationId)
        try {
          const station = await stationService.getById(stationId);
          console.log('station', station)
          this.stationTitle = station.title
        } catch (error) {
          console.log('Error fetching station: ', error);
        }
      },
      immediate: true,
    },
  },
  components: {
    SongSearchList,
    SongSearch,
    PlayBtn,
  },
};
</script>
