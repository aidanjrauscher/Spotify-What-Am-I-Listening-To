import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getTrack } from '../utils/getTrack'

export async function getServerSideProps(){
  const trackInfo = await getTrack()
  return{
    props: {
      trackInfo,
    },
  };
}

export default function Page({trackInfo}) {
  return (
    <div>
      <Head>
        <title>Aidan&apos;s Music</title>
        <meta name="description" content="What is Aidan listening too?" />
        <link rel="icon" href={trackInfo.image} />
      </Head>
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <TrackTitle trackTitle={trackInfo.track_name}/>
      <br></br>
      <TrackLink trackImage = {trackInfo.image} trackURL={trackInfo.track_url}/>
      </div>
      <footer>
      </footer>
    </div>
  )
}

let TrackTitle = ({trackTitle})=>{
  return(
    <div>
      <h1 className="font-sans text-3xl font-semibold">{trackTitle}</h1>
    </div>
  );
}


let SpinningRecord = ()=>{
  return(
    <div className="relative">
      <div className="absolute w-80 h-80 bg-black rounded-full">
        <div className="mt-12 ml-12 absolute w-24  h-24 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
}


let TrackLink = ({trackImage, trackURL})=>{
  return(
    <div className="relative">
      <Link href={trackURL}>
        <a target="_blank">
          <TrackImage trackImage={trackImage} />
        </a>
      </Link>
    </div>
  );
}


let TrackImage = ({trackImage})=>{
  return (
  <Image
    className="hover:animate-pulse"
    src={trackImage}
    width={500}
    height={500}
    alt="Picture of album cover."
  />
  );
}
