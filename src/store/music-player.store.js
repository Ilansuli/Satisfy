import { utilService } from '../services/util.service.js'
export const musicPlayerStore = {
    state: {
        currentSong: {
            // imgUrl: 'https://i.ytimg.com/vi/Zi_XLOBDo_Y/default.jpg',
            // title: 'Billie Jean',
            // videoId: 'Zi_XLOBDo_Y',
        },
        currentStation: {},
        isPlaying: false,
        youtubeRef: null,
    },
    getters: {
        currentSong({ currentSong }) { return currentSong },
        currentStation({ currentStation }) { return currentStation },
        isPlaying({ isPlaying }) { return isPlaying }
    },
    mutations: {
        play(state) {
            state.isPlaying = true
        },
        pause(state) {
            state.isPlaying = false
        },
        setCurrentSong(state, { song }) {
            console.log('store setCurrentSong', song);
            state.currentSong = (song) ? { ...song } : null
        },
        pauseResume(state) {
            this.isPlaying = !this.isPlaying
            // if (this.isPlaying) this.$refs.youtube.playVideo()
            if (this.isPlaying) state.youtubeRef.playVideo()
            // else this.$refs.youtube.pauseVideo()
            else state.youtubeRef.pauseVideo()
        },
        //TODO: COMBINE NEXT AND PREV FUNCTIONS
        setNextSong(state) {
            if (!state.currentSong) return
            const currentSongIdx = state.currentStation.songs.findIndex(song => song._id === state.currentSong._id)
            if (currentSongIdx + 1 > state.currentStation.songs.length - 1) return
            const nextSong = state.currentStation.songs[currentSongIdx + 1]
            state.currentSong = { ...nextSong }

        },
        setSameSong(state) {
            if (!state.currentSong) return
            const currentSongIdx = state.currentStation.songs.findIndex(song => song._id === state.currentSong._id)
            const sameSong = state.currentStation.songs[currentSongIdx]
            state.currentSong = { ...sameSong }
        },
        setRandomSong(state) {
            if (!state.currentSong) return
            const nextSong = state.currentStation.songs[utilService.getRandomIntInclusive(0, state.currentStation.songs.length - 1)]
            state.currentSong = { ...nextSong }
        },
        setPrevSong(state) {
            if (!state.currentSong) return
            const currentSongIdx = state.currentStation.songs.findIndex(song => song._id === state.currentSong._id)
            const prevSong = state.currentStation.songs[currentSongIdx - 1]
            if (currentSongIdx - 1 < 0) return
            state.currentSong = { ...prevSong }
        },
        setCurrentStation(state, { station }) {
            state.currentStation = (station) ? { ...station } : null
        },
        setYoutubeRef(state, { ref }) {
            state.youtubeRef = ref
        }
    },
    actions: {
        setSong({ commit }, { song }) {
            console.log('store actions',song);
            commit({ type: 'setCurrentSong', song })
        },
        setNextSong({ commit }) {
            commit({ type: 'setNextSong' })
        },
        setSameSong({ commit }) {
            commit({ type: 'setSameSong' })
        },
        setRandomSong({ commit }) {
            commit({ type: 'setRandomSong' })
        },
        setPrevSong({ commit }) {
            commit({ type: 'setPrevSong' })
        },
        setStation({ commit }, { station }) {
            commit({ type: 'setCurrentStation', station })
        },
        pauseResume({commit}){
            commit({type:'pauseResume'})
        }
    }
}