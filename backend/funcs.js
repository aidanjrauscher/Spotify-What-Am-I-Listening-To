const axios = require("axios");
const { syncBuiltinESMExports } = require("module");
require('dotenv').config();
const qs = require("qs");

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN
const auth_token = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')

let auth = async ()=>{
    try{
        const url =  'https://accounts.spotify.com/api/token'
        const auth_response = await axios.post(url,
            qs.stringify({'grant_type': 'refresh_token','refresh_token': refresh_token}),
            {
                headers:{
                'Authorization': auth_token,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }}
        )
        return auth_response.data.access_token
    }
    catch(error){
        console.log('Spotify API authorization: ' + error)
    }
}

let currentTrack = async (token)=>{
    const current_track_url = 'https://api.spotify.com/v1/me/player/currently-playing'
    try{
        const track_response = await axios.get(current_track_url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        return track_response.data; 
    }
    catch(error){
        console.log('Error getting playback state: ' + error)
        return '' 
    }

}

let recentTrack = async (token)=>{
    const recent_track_url = 'https://api.spotify.com/v1/me/player/recently-played'
    try{
        const tracks_response = await axios.get(recent_track_url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        return tracks_response.data.items[0].track; 
    }
    catch(error){
        console.log('Error getting playback state: ' + error)
        return '' 
    }

}

let getTrack = async ()=>{
    const token = await auth()
    const current_track = await currentTrack(token)
    let track; 
    let track_status; 
    if(current_track=='' || current_track.currently_playing_type != 'track'){
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
    for(let i=0; i<artist_object.length; i++){
        artist_array.push(artist_object[i].name)
    }
    let image_object = track.album.images
    let image_array = []
    for(let i=0; i<image_object.length; i++){
        image_array.push(image_object[i].url)
    }
    let track_info = {
        track_status: track_status,
        track_url: track_url,
        track_name: track_name,
        album_name: album_name, 
        artists: artist_array,
        image: image_array[0]
    }

    return track_info
}

exports.getTrack = getTrack;