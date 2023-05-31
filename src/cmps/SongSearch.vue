<template>
        <form @submit.prevent="setSearch">
                <div class="search-icon" v-html="getSvg('emptySearch')"></div>
                <input name="search" type="text" v-model="query" :placeholder="isSearchPage? 'What do you want to listen to?' :'Search for songs'" />
                <div @click="deleteInputValue" class="x-icon" v-html="getSvg('x')"></div>
        </form>
</template>

<script>
import { svgService } from '../services/svg.service.js';

export default {
    name: 'Song Search',
    data() {
        return {
            query: '',
            isSearchPage: false
        }
    },
    methods: {
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        setSearch() {
            this.$emit('setSearch', this.query)
        },
        deleteInputValue(){
            this.query = ''
        }
    },
    computed: {
        setParams(){
           
        }
    },
    created() {

    },
    components: {

    },
    watch: {
    '$route': {
      handler() {
        const { path } = this.$route
        if(path ==='/search'){
            this.isSearchPage = true
            this.query = ''
        }else this.isSearchPage = false
        // this.isSearchPage= (path === '/search') ? true : false
      },
      immediate: true,
    },
  },
}
</script>

<style></style>