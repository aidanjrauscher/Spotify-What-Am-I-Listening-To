const qs = require("qs");

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; 
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN
const auth_token = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')

let auth = async ()=>{
    try{
        const url =  'https://accounts.spotify.com/api/token'
        const auth_response = await fetch(url, {
            method: 'POST',
            headers:{
                'Authorization': auth_token,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: 'grant_type=refresh_token&refresh_token=' + refresh_token
        })
        if(auth_response.status == 200){
            const auth_response_data = await auth_response.json()
            return auth_response_data.access_token
        }
        else{
            throw 'INVALID AUTH RESPONSE'
        }
    }
    catch(error){
        console.log('Spotify API authorization: ' + error)
    }
}

let currentTrack = async (token)=>{
    const current_track_url = 'https://api.spotify.com/v1/me/player/currently-playing'
    try{
        const track_response = await fetch(current_track_url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const track_response_status = track_response.status
        if(track_response_status == 200){
            const track_response_data = await track_response.json()
            return track_response_data; 
        }
        else if(track_response_status == 204){
          return 'off' 
        }
        else{
            throw 'ERROR'
        }
    }
    catch(error){
        console.log('Error getting playback state: ' + error)
        return 'off' 
    }

}

let recentTrack = async (token)=>{
    const recent_track_url = 'https://api.spotify.com/v1/me/player/recently-played'
    try{
        const tracks_response = await fetch(recent_track_url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const tracks_response_data = await tracks_response.json()
        const first_track = tracks_response_data.items[0].track
        return first_track
    }
    catch(error){
        console.log('Error getting playback state: ' + error)
        return '' 
    }
    
}

export async function getTrack(){
    const token = await auth()
    const current_track = await currentTrack(token)
    let track; 
    let track_status; 
    if(current_track=='off' || current_track.currently_playing_type != 'track'){
        const recent_track = await recentTrack(token)
        track = recent_track;
        track_status = 'Recently Listened To'
    }
    else{
        track = current_track.item; 
        track_status = 'Currently Listening To'
    }
    let track_url = track.external_urls.spotify
    let track_name = track.name
    let album_name = track.album.name
    let artist_object = track.artists
    let artist_array = []
    for(const elem of artist_object){
        artist_array.push(elem.name)
    }
    let image_object = track.album.images
    let image_array = []
    for(const elem of image_object){
        image_array.push(elem.url)
    }
    let track_info = {
        track_status: track_status,
        track_url: track_url,
        track_name: track_name,
        album_name: album_name, 
        artists: artist_array,
        image: image_array[0]
    }
    return track_info;
}
