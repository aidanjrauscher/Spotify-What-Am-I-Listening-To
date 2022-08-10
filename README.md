# Spotify-What-Am-I-Listening-To

#### This a website that allows visitors to see what I am currently listening, or have recently listened, to on Spotify. 

#### Built using React, Express, and Node. The library Axios is employed to make requests to the Spotify API. 

#### I am using the Spotify API's Authorization Code Flow, however I am using my own Spotify account credentials so visitors do not need to authorize access. I manually retrieved my personal authorization code, which I used to get the 'referesh token' that allows the API perpetual access to my personal account.

![diagram of spotify's authroization code flow](./doc_images/spotify_authorization_code_flow.png)
#### The following steps can be used to get the refresh token, which allows for perpetual use of my own account authorization:
    1. Set the project's redirect URI in the Spotify API dashboard
    2. Get the URL encoding of the redirect URI
    2. Visit the following link: https://accounts.spotify.com/authorize?client_id=<CLIENT_ID>&scope=<SCOPE>&response_type=code&redirect_uri=<URL_ENCODED_REDIRECT_URI>
    3. Agree to allow the API access to the account
    4. After accepting, the page will be redirected to the given URI. Copy the authorization code from the redirect link, which will be in the form <REDIRECT_URI>?code=<AUTHORIZATION_CODE>
    5. Get the authorization token, which is the base 64-encoding of the string <CLIENT_ID>:<CLIENT_SECRET>
    6. Run the following curl command: curl -H "Authorization: Basic <AUTHORIZATION_STRING>" -d grant_type=authorization_code -d code=<AUTHORIZATION_TOKEN> -d redirect_uri=<URL_ENCODED_REDIRECT_URI> https://accounts.spotify.com/api/token
    7. Record the <ACCESS_TOKEN> and <REFRESH_TOKEN> from the curl responses