<template>
  <section class="login-signup">
    <section class="login-signup-logo">
      <span>{{ isLogin ? 'Login' : 'Sign up' }}</span>
    </section>
    <div class="login-signup-wrapper">
      <p>To continue, {{ isLogin ? 'login' : 'sign up' }} to Satisfy.</p>
      <section v-if="isLogin" class="login-form">
        <form @submit.prevent="doLogin">
          <p :class="isInvalid ? 'invalid' : ''">Username</p>
          <div :class="isInvalid ? 'invalid' : ''" class="input-wrapper">
            <input placeholder="username" type="text" name="username" v-model="loginCred.username" />
          </div>
          <p>Password</p>
          <div :class="isInvalid ? 'invalid' : ''" class="input-wrapper password">
            <input placeholder="password" :type="isPassShown ? 'text' : 'password'" name="password"
              v-model="loginCred.password" />
            <div @click="handleEye" v-if="!isPassShown" :class="isEyeClicked ? 'clicked' : ''" class="eye-icon"
              v-html="getSvg('eyeCross')"></div>
            <div @click="handleEye" v-else :class="isEyeClicked ? 'clicked' : ''" class="eye-icon" v-html="getSvg('eye')">
            </div>
          </div>
          <button style="color:black">CONNECTION</button>
        </form>
        <hr />
        <RouterLink class="route-to-signup" to="/signup">Don't have an account?</RouterLink>
      </section>

      <section v-if="!isLogin" class="login-form">
        <form @submit.prevent="doSignup">
          <p :class="isInvalid ? 'invalid' : ''">Fullname</p>
          <div :class="isInvalid ? 'invalid' : ''" class="input-wrapper">
            <input placeholder="fullname" type="text" name="fullname" v-model="signupCred.fullname" />
          </div>
          <p :class="isInvalid ? 'invalid' : ''">Username</p>
          <div :class="isInvalid ? 'invalid' : ''" class="input-wrapper">
            <input placeholder="username" type="text" name="username" v-model="signupCred.username" />
          </div>
          <p>Password</p>
          <div :class="isInvalid ? 'invalid' : ''" class="input-wrapper password">
            <input placeholder="password" :type="isPassShown ? 'text' : 'password'" name="password"
              v-model="signupCred.password" />
            <div @click="handleEye" v-if="!isPassShown" :class="isEyeClicked ? 'clicked' : ''" class="eye-icon"
              v-html="getSvg('eyeCross')"></div>
            <div @click="handleEye" v-else :class="isEyeClicked ? 'clicked' : ''" class="eye-icon" v-html="getSvg('eye')">
            </div>
          </div>
          <button style="color:black">Sign up</button>

        </form>
        <hr />
      </section>
    </div>
  </section>
</template>
<script>

import ImgUploader from '../cmps/ImgUploader.vue'
import { svgService } from '../services/svg.service.js'
export default {
  name: 'login-signup',
  data() {
    return {
      msg: '',
      loginCred: { username: 'user1', password: '123' },
      signupCred: { username: '', password: '', fullname: '', imgUrl: '' },
      isPassShown: false,
      isEyeClicked: false,
      isInvalid: false,
      isLogin: false
    }
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
  },
  created() {
    this.loadUsers()
  },
  methods: {
    handleEye() {
      this.isPassShown = !this.isPassShown
      this.isEyeClicked = true
    },
    async doLogin() {
      if (!this.loginCred.username) {
        this.msg = 'Oops! Something went wrong, check Username or Password.'
        return
      }
      try {
        await this.$store.dispatch({ type: "login", userCred: this.loginCred })
        await this.$store.dispatch({ type: 'setUserStations' })
        this.$router.push('/')
      } catch (err) {
        console.log(err)
        this.isInvalid = true
      }
    },
    async doSignup() {
      if (!this.signupCred.fullname || !this.signupCred.password || !this.signupCred.username) {
        this.msg = 'Please fill up the form'
        return
      }
      await this.$store.dispatch({ type: 'setUserStations' })
      await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
      this.$router.push('/')

    },
    loadUsers() {
      this.$store.dispatch({ type: "loadUsers" })
    },
    async removeUser(userId) {
      try {
        await this.$store.dispatch({ type: "removeUser", userId })
        this.msg = 'User removed'
      } catch (err) {
        this.msg = 'Failed to remove user'
      }
    },
    onUploaded(imgUrl) {
      this.signupCred.imgUrl = imgUrl
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    }

  },
  watch: {
    '$route': {
      handler() {
        const { path } = this.$route;
        this.isLogin = (path === '/login') ? true : false
      },
      immediate: true,
    },
  },
  components: {
    ImgUploader
  }
}
</script>