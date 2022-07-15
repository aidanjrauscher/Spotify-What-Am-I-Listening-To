const http = require("http");
const https = require("https");
const express = require("express");
const axios = require("axios");
const cookieParser = require('cookie-parser');

const funcs = require("./funcs");


const hostname = '127.0.0.1' 
const port = '3001'

const app = express()

app.get('/',async (req,res)=>{

    let track_info = await funcs.getTrack();
    res.send(`<h1>${track_info.track_status}</h1><br>` +
            `<h2>Track Name: ${track_info.track_name}</h2><br>`+
            `<h3>Album Name: ${track_info.album_name}</h2><br>`+
            `<p>Artist Name(s):<br> ${track_info.artists.join('<br>')}</h2><br><br>`+
            `<a href="${track_info.track_url}" target="_blank">` + 
                `<img  style="height: 320px; width:320px; "src="${track_info.image}">` + 
            `</a>`);

})

app.listen(port, ()=>{
    console.log(`Server listening on http://${hostname}:${port}`)
})

