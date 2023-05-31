
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'


const STORAGE_KEY = 'station'

export const stationService = {
    getEmptyStation,
    query,
    getById,
    save,
    remove,
    addStationMsg,
    getEmptySong,
    getLabels,
    getUserStations,
    getLabelStations,
}
window.cs = stationService


async function query(filterBy = { owner: '' }) {
    return httpService.get(STORAGE_KEY, filterBy)

    // var stations = await storageService.query(STORAGE_KEY)
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     stations = stations.filter(station => regex.test(station.title) || regex.test(station.description))
    // }
    // if (filterBy.listencount) {
    //     stations = stations.filter(station => station.listencount <= filterBy.listencount)
    // }
    // return stations

}
async function getUserStations(userId) {
    return await query({ owner: userId })
}
async function getLabelStations(labelName) {
    return await query({ label: labelName })
}
function getById(stationId) {
    // return storageService.get(STORAGE_KEY, stationId)
    return httpService.get(`station/${stationId}`)
}

async function remove(stationId) {
    // await storageService.remove(STORAGE_KEY, stationId)
    return httpService.delete(`station/${stationId}`)
}
async function save(station) {
    var savedStation
    if (station._id) {
        // savedStation = await storageService.put(STORAGE_KEY, station)
        savedStation = await httpService.put(`station/${station._id}`, station)

    } else {
        // Later, owner is set by the backend
        station.owner = userService.getLoggedinUser()
        // savedStation = await storageService.post(STORAGE_KEY, station)
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const savedMsg = await httpService.post(`station/${stationId}/msg`, { txt })
    return savedMsg
}


function getEmptyStation() {
    return {
        //TODO: ADD COUNTER
        title: 'My Playlist',
        userDesc: '',
        imgUrl:
            'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683826469/WhatsApp_Image_2023-05-11_at_20.32.48_ybb9ov.jpg',
        songs: [],
        isAddedByUser: true,
    }
}

function getEmptySong() {
    return {
        title: '',
        _id: utilService.makeId(6),
        album: '',
        artist: '',
        videoId: '',
        imgUrl: '',
        addedBy: '',
        duration: 0,
        addedAt: Date.now(),
    };
    
}
function getLabels() {
    return [
        {
            name: 'Pop',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Pop_g7mqwn.jpg',
        },
        {
            name: 'Mood-Booster',
            imgUrl:
                'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Mood_yqq19z.jpg',
        },
        {
            name: 'Latino',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Latin_nimomc.jpg',
        },
        {
            name: 'Rock',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Rock_ee61mk.jpg',
        },
        {
            name: 'Rap',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Hip-Hop_fo6kbo.jpg',
        },
        {
            name: 'K-Pop',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/K-Pop_l8dizv.jpg',
        },
        {
            name: 'Dance/Electronic',
            imgUrl:
                'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/DanceElectorincs_qxedq7.jpg',
        },
        {
            name: 'Sleep',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/Sleep_cpxoaa.jpg',
        },
        {
            name: 'R&B',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/R_B_bjdzcf.jpg',
        },
        {
            name: 'Anime',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/Anime_btb9hc.jpg',
        },
        {
            name: 'Focus',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727388/Focus_d1avyn.jpg',
        },
        {
            name: 'Stress Relief',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728053/Stress_Relief_sfslpw.jpg',
        },
        {
            name: 'Jazz',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/Jazz_zgbtbt.jpg',
        },
        {
            name: 'Metal',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727388/Metal_tidcaf.jpg',
        },
        {
            name: 'Love',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728875/Love_iflqwr.jpg',
        },
        {
            name: 'Party',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/Party_nyroqe.jpg',
        },
        {
            name: 'Country',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Country_r1ivgb.jpg',
        },
        {
            name: 'Chill',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/Chill_ryfb1u.jpg',
        },
        {
            name: 'Workout',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Workout_tjxlzd.jpg',
        },
        {
            name: 'Indie',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729066/Indie_qkuqnb.jpg',
        },
        {
            name: 'Gaming',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728875/Gaming_fuscfy.jpg',
        },
        {
            name: 'Folk & Acoustic',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727388/Folk_Acoustic_qsvi3c.jpg',
        },
        {
            name: 'Soul',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727388/Soul_v4qbcm.jpg',
        },
        {
            name: 'Instrumental',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727388/Instrumental_p3m6kq.jpg',
        },
        {
            name: 'Summer',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Summber_iz5eqy.jpg',
        },
        {
            name: 'Fresh Finds',
            imgUrl: 'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728875/FreshFInds_lqkqls.jpg',
        },
        {
            name: 'New releases',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728879/NewRealese_sjs1g3.jpg'
        },
        {
            name: 'Hip-Hop',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Hip-Hop_fo6kbo.jpg'
        },
        {
            name: 'At Home',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728879/AtHome_cfiqco.jpg'
        },
        {
            name: 'Decades',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727387/Decades_r4i3io.jpg'
        },
        {
            name: 'Wellness',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728879/Wellness_l2hhfh.jpg'
        },
        {
            name: 'Trending',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728879/Trending_drtpec.jpg'
        },
        {
            name: 'TV & Movies',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727388/Tv_Shows_dfh9mf.jpg'
        },
        {
            name: 'Classical',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727388/Classical_pkpph1.jpg'
        },
        {   
            name: 'Kids & Family',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728875/Kids_rjosan.jpg'
        },
        {
            name: 'Punk',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Punk_rcdomz.jpg'
        },
        {
            name: 'Blues',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728876/Blues_uhpztk.jpg'
        },
        {
            name: 'Afro',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683727386/Afro_tbmtz7.jpg'
        },
        {
            name: 'Travel',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728876/Travel_xre3or.jpg'
        },
        {
            name: 'Tastemaker',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728877/TasteMakers_ntmh4n.png'
        },
        {
            name: 'Caribbean',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728885/Carribean_sny0zf.jpg'
        },
        {
            name: 'Cooking & Dining',
            imgUrl:'https://res.cloudinary.com/dmmsf57ko/image/upload/v1683728885/Cooking_Dining_fqckg7.jpg'
        },





        
        
        
        
        
        
        
    ];
}






