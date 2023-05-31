import { utilService } from "./util.service"
const API_KEY = 'AIzaSyDpWEOuDYmh2IQEg7ehFtvcaO6zEokzS_I'

export async function getSongs(query) {
    const API = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${API_KEY}`
    try {
        const response = await fetch(API)
        const { items } = await response.json()
        const songs = await Promise.all(_prepSongs(items))
        return songs
    } catch (error) {
        console.error(error);
    }
}

function _prepSongs(items) {
    return items.map(async ({ id, snippet }) => {
        const { videoId } = id
        const imgUrl = snippet.thumbnails.medium.url || ''
        const title = _cleanTitle(snippet.title)
        const duration = await _getDuration(videoId)
        const { album} = await _getSongData(title)
        const artist = _getArtist(snippet.title)
        console.log(title);
        return _createSong(title, album, artist, videoId, imgUrl, duration)
    })
}
function _getArtist(title) {
    const pattern = /^(.+?)\s*[-–]\s*(.+?)(?:\s+\[(.+?)\])?$/i;
    const matches = pattern.exec(title);
    if (matches) {
        const songArtist = matches[1]
       return  songArtist
    }
}
async function _getSongData(title) {
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': 'e57298fe2bmsh9954556bca47bc9p1892c9jsnc213b921096a',
    //         'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    //     }
    // };
    // const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${title}`

    try {
        // const res = await fetch(url, options)
        // const data = await res.json()
        // console.log(data)
        return { album: 'NA', artist: 'VA' }
    }
    catch (err) {
        console.dir(err)
    }
}

async function _getDuration(videoId) {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos")
    url.search = new URLSearchParams({
        key: API_KEY,
        part: "contentDetails",
        id: videoId,
    }).toString()

    try {
        const res = await fetch(url)
        const data = await res.json()
        const videos = data?.items || []
        return videos.map(video => {
            return _getDurationStr(video?.contentDetails?.duration)
        })[0]
    }
    catch (err) {
        console.dir(err)
    }
}

function _cleanTitle(title) {
    // Remove unwanted words
    const unwantedWords = ['Official', 'HD', 'Video', 'Clean', 'Version', 'Music', 'Lyrics']
    unwantedWords.forEach((word) => {
        const regex = new RegExp('\\b' + word + '\\b', 'gi')
        title = title.replace(regex, '');
    })

    // Replace special characters with spaces, except for the '-' character
    let cleanTitle = title.replace(/[^\w\s-]/gi, ' ')

    // Replace consecutive spaces with a single space
    cleanTitle = cleanTitle.replace(/\s+/g, ' ')
    cleanTitle = cleanTitle.trim()
    if (cleanTitle[cleanTitle.length - 1] === '-') {
        cleanTitle = cleanTitle.slice(0, -1)
    }
    return cleanTitle
}

function _createSong(title, album, artist, videoId, imgUrl, duration,) {
    return {
        _id: utilService.makeId(),
        addedAt: Date.now(),
        title,
        album,
        artist,
        videoId,
        imgUrl,
        duration,
    }
}

function _getDurationStr(durationString) {
    const duration = { hours: '', minutes: '', seconds: '' };
    const durationParts = durationString
        .replace("PT", "")
        .replace("H", ":")
        .replace("M", ":")
        .replace("S", "")
        .split(":");

    if (durationParts.length === 3) {
        duration["hours"] = durationParts[0];
        duration["minutes"] = durationParts[1];
        duration["seconds"] = durationParts[2];
    }

    if (durationParts.length === 2) {
        duration["minutes"] = durationParts[0];
        duration["seconds"] = durationParts[1];
    }

    if (durationParts.length === 1) {
        duration["seconds"] = durationParts[0];
    }

    let timeStr = ''
    for (const key in duration) {
        if (key === 'hours' && !duration[key]) continue
        timeStr += duration[key].padStart(2, '0') + ':'
    }
    return timeStr.slice(0, -1)
}