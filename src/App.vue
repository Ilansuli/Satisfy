<template>
  <div @click="closeModals" class="layout-container">
    <AppHeader />
    <MainNav />
    <AppFooter />
    <div @scroll="handleScroll" class="app-main" ref="appMain" :style="{ backgroundImage: backgroundColor }">
      <RouterView />
      <UserMsg />
    </div>
  </div>
</template>

<script>
import { userService } from './services/user.service';
import { socketService } from './services/socket.service';

import { store } from './store/store';

import AppHeader from './cmps/AppHeader.vue';
import MainNav from './cmps/MainNav.vue';
import AppFooter from './cmps/AppFooter.vue';
import UserMsg from './cmps/UserMsg.vue';
import { showSuccessMsg } from './services/event-bus.service';

export default {
  created() {
    const user = userService.getLoggedinUser();
    if (user) store.commit({ type: 'setLoggedinUser', user });
    this.$store.dispatch({ type: 'loadStations' });
  },

  computed: {
    backgroundColor() {
      if (
        this.$store.getters.currColor === 'black' ||
        this.$store.getters.currColor === 'rgb(0,0,0)' ||
        this.$store.getters.currColor === 'rgb(28, 11, 59)'
      ) {
        return `linear-gradient(0deg, #121212 88%, ${this.$store.getters.currColor}`;
      } else {
        return `linear-gradient(0deg, #121212 55%, ${this.$store.getters.currColor}`;
      }
    },
  },
  methods: {
    closeModals() {
      this.$store.commit({ type: 'closeModals' })
   
    },
    handleScroll() {
      const appMain = this.$refs.appMain;
      const scrollTop = appMain.scrollTop;
      const opacity = 1 - scrollTop / 100;
      // this.$store.dispatch('setCurrColor', `rgb(0, 0, 0)`);
      this.$store.dispatch('setOpacity', opacity);
    },
  },
  mounted() {
    const app = this.$refs.appMain;
    app.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    const app = this.$refs.appMain;
    app.removeEventListener('scroll', this.handleScroll);
  },
  components: {
    AppHeader,
    MainNav,
    AppFooter,
    UserMsg,
  },
};
</script>
