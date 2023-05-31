<template>
    <article :class="getClass" class="song-preview-main" @click="handleClick" @mouseover="isHover = true"
        @mouseleave="isHover = false">
        <div class="played-song-gif" @click="setSong(), setStation()" v-if="isPlaying && currSong._id === song._id" >
            <img src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729372/Song_hoitzd.gif" alt="">
        </div>
        <div v-else v-html="playBtnSvg" :class="getPlayedSongClass" class="play-song-icon" @click="setSong(), setStation()"></div>
        <!-- <span v-if="isHover">5</span> -->
        <div class="song-preview-content">
            <div class="song-preview-img">
                <img :src="song.imgUrl" />
            </div>

            <div class="song-preview-name">
                <span :class="getPlayedSongClass" class="song-preview-name-title">
                    {{ shortenedTitle(songTitle) }}
                </span>
                <span :class="getClass">
                    {{ song.artist }}
                </span>
            </div>

        </div>
        <!-- <p>{{ song.album }}</p> -->
        <div v-if="!station.isAddedByUser" class="column-3" :class="getClass">{{ song.album }}</div>

        <div class="column-4">{{ songAddedAt }}</div>
        <div class="column-5">
            <div :class="station.isAddedByUser ? 'song-preview-preferences custom-heart' : 'song-preview-preferences'">
                <span @click="isLiked ? unlikeSong() : likeSong()" :class="getClass" class="heart-icon">
                    <div v-html="isLiked ? getSvg('heartFull') : getSvg('heart')"></div>
                </span>
                <div>{{ song.duration }}</div>
                <span v-if="station.isAddedByUser" :class="getClass" @click="removeSong" v-html="getSvg('trash')"
                    class="trash-icon"></span>
                <!-- <span :class="getClass" @click="removeSong" class="trash-icon" v-html="getSvg('trash')"></span> -->
                <span v-else></span>
            </div>
        </div>
    </article>
</template>

<script>
import { watch } from 'vue'
import { eventBus } from '../services/event-bus.service'
import { svgService } from '../services/svg.service.js'
import { userService } from '../services/user.service'
export default {
    name: 'Song Preview',
    emits: ['removeSong', 'setSong', 'setStation', 'setActiveSong'],
    props: {
        song: {
            type: Object
        },
        station: {
            type: Object
        },
        index: {
            type: Number,
        },
        activeSongId: {
            type: String
        }
    },
    created() {

    },
    data() {
        return {
            isHover: false,
            isActive: false,
        }
    },
    methods: {
        removeSong() {
            this.$emit('removeSong', this.song._id)
        },
        getSvg(iconName) {
            if (this.isHover || this.activeSongId === this.song._id) return svgService.getSvg(iconName)
            else if (iconName === 'playSongSmall') return this.index + 1
        },
        setSong() {
            this.$emit('setSong', this.song)
        },
        setStation() {
            this.$emit('setStation', this.station)
            eventBus.emit('onTogglePlay')
        },
        handleClick() {
            this.$emit('setActiveSong', this.song._id)
        },
        likeSong() {
            const user = this.$store.getters.loggedinUser
            this.$store.dispatch({ type: 'addLikedSong', song: this.song })
        },
        unlikeSong() {
            const user = this.$store.getters.loggedinUser
            this.$store.dispatch({ type: 'removeLikedSong', song: this.song })
        }
        // async songAlbum() {
        //     try {
        //         const response = await fetch(
        //             `https://api.deezer.com/search?q=without me`
        //         )
        //         console.log(response)
        //     } catch (err) {
        //         console.log('cant find song', err)
        //     }
        // }
        //          const {data} = response.json
    },
    computed: {
        playBtnSvg() {
            if (this.isPlaying && this.currSong._id === this.song._id) {
                return this.getSvg('pauseSmall')
            } else return this.getSvg('playSongSmall')
        },
        isLiked() {
            const user = this.$store.getters.loggedinUser
            if (!user) return false
            const userLikedSongs = user.likedSongs
            const res = userLikedSongs.findIndex(song => song._id === this.song._id)
            if (res >= 0) return true
            return false
        },
        currSong() {
            return this.$store.getters.currentSong
        },
        isPlaying() {
            return this.$store.getters.isPlaying
        },
        getClass() {
            return {
                'hover': this.isHover || this.isActive,
                'active': this.activeSongId  === this.song._id,
                'not-custom': !this.station.isAddedByUser,
                'custom': this.station.isAddedByUser
            }
        },
        shortenedTitle() {
            const maxLength = 30
            return function (title) {
                return title.length > maxLength ? title.slice(0, maxLength) + '...' : title
            }
        },
        songAddedAt() {
            const addedAt = this.song.addedAt
            const now = Date.now()
            const diff = now - addedAt
            if (diff < 60 * 1000) { // less than 1 minute
                return `${Math.floor(diff / 1000)} seconds ago`
            } else if (diff < 60 * 60 * 1000) { // less than 1 hour
                return `${Math.floor(diff / (60 * 1000))} minutes ago`
            } else if (diff < 24 * 60 * 60 * 1000) { // less than 1 day
                return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`
            } else { // 1 day or more
                return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`
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
        getPlayedSongClass() {
            return {
                'played': this.isPlaying && this.currSong._id === this.song._id   
            }
        }
        // songArtist() {
        //     const pattern = /^(.+?)\s*[-–]\s*(.+?)(?:\s+\[(.+?)\])?$/i;
        //     const matches = pattern.exec(this.song.title);
        //     if (matches) {
        //         const songArtist = matches[1]
        //         return songArtist
        //     }
        // },
    },

}
</script>
