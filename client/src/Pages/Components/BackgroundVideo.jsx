import './Styles/BackgroundVideo.css';
import backgroundVideo from '../../assets/videos/backgroundvideo.mp4';

function BackgroundVideo() {
    return (
        <video autoPlay muted id="background-video">
            <source src={backgroundVideo} type='video/mp4' />
        </video>
    );
}

export default BackgroundVideo;