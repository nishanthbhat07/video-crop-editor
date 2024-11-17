import Footer from '../../components/footer'
import VideoPlayer from '../../components/video-player'
import VideoSettings from '../../components/video-settings'
import { VideoProvider } from '../../context/video'
import './styles.css'

export default function VideoEditor() {
  return (
    <VideoProvider>
      <div className="container-wrapper">
        <h2>Cropper</h2>
        <VideoPlayer />
        <VideoSettings />
      </div>
      <Footer />
    </VideoProvider>
  )
}
