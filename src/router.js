import { createRouter, createWebHashHistory } from 'vue-router'

import StationIndex from './views/StationIndex.vue'
import LikedSongs from './views/LikedSongs.vue'
import LoginSignup from './views/LoginSignup.vue'
import UserDetails from './views/UserDetails.vue'
import SearchPage from './views/SearchPage.vue'
import LibraryPage from './views/LibraryPage.vue'
import GenreDetails from './views/GenreDetails.vue'
import StationDetails from './views/StationDetails.vue'

const routes = [
  {
    path: '/',
    redirect: '/station',
  },
  {
    path: '/station',
    name: 'StationIndex',
    component: StationIndex
  },
  {
    path: '/liked',
    name: 'LikedSongs',
    component: LikedSongs
  },
  {
    path: '/station/:stationId',
    name: 'StationDetails',
    component: StationDetails
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginSignup
  },
  {
    path: '/signup',
    name: 'Signup',
    component: LoginSignup
  },
  {
    path: '/user/:id',
    name: 'UserDetails',
    component: UserDetails
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryPage
  },
  {
    path: '/genre/:label',
    name: 'genre',
    component: GenreDetails
  },

]


export const router = createRouter({
  routes,
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

