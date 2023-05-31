<template>
    <section class="song-search-preview" :class="getClass" @mouseover="isHover = true" @mouseleave="isHover = false">
        <div class="song-search-preview-img-title-wrap">

            <div class="img-wrap">
                <article class="play-song-btn">
                    <div v-html="getSvg('playSong')" class="play-song-icon" @click="setSong"></div>
                </article>
                <img :src="song.imgUrl" alt="" />
            </div>


            <div class="song-search-preview-details">
                <h3>{{ songTitle }}</h3>
                <h6 class="song-search-preview-artist" :class="getClass">{{song.artist}}</h6>
            </div>

        </div>
        <p>
            
        </p>
        <!-- <p :class="getClass" class="song-search-preview-album">
            {{song.album}}
        </p> -->

        <div>
            <button v-if="!isSearchPage" class="song-search-preview-add-btn" @click="addSong">Add</button>
        </div>

        <iframe hidden width="60" height="15" :src="'https://www.youtube.com/embed/' + song.videoId" frameborder="0"
            allowfullscreen></iframe>
    </section>
</template>

<script>
import { stationService } from '../services/station.service.js';
import { svgService } from '../services/svg.service.js';
export default {
    name: 'Song Search Preview',
    props: {
        song: {
            type: Object
        }
    },
    emits: ['addSong','setSong'],
    data() {
        return {
            isHover: false,
            isSearchPage: false

        }
    },
    methods: {
        addSong() {
            this.$emit('addSong', this.song);
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        setSong() {
            this.$emit('setSong', this.song)
        },
    },
    computed: {
        getClass() {
            return {
                'hover': this.isHover
            }
        },
        shortenedTitle() {
            const maxLength = 30
            return function (title) {
                return title.length > maxLength ? title.slice(0, maxLength) + '...' : title
            }
        },
        songTitle() {
            // const pattern = /(.+)\s-\s(.+)(?:\s\[[^\]]*\])?\s\(/;
            const pattern = /^(.+?)\s*[-–]\s*(.+?)(?:\s+\[(.+?)\])?$/i;


            const matches = pattern.exec(this.song.title);
            if (matches) {
                const songTitle = matches[2]
                // verification second round
                const regex = /^(.+)\s+\(.+\)$/;
                const match = songTitle.match(regex);
                if (match) {
                    return match[1].trim();
                }
                return songTitle
            } else {
                return this.song.title
            }
        },
        // songArtist() {
        //     const pattern = /^(.+?)\s*[-–]\s*(.+?)(?:\s+\[(.+?)\])?$/i;
        //     const matches = pattern.exec(this.song.title);
        //     if (matches) {
        //         const songArtist = matches[1]
        //         this.song.artist=songArtist
        //        return  songArtist
        //     }
        // },
    },

    watch: {
        '$route': {
            handler() {
                const { path } = this.$route
                if (path === '/search') this.isSearchPage = true
            },
            immediate: true,
        },

    },
    created(){
    }

}
</script>

<style></style>
