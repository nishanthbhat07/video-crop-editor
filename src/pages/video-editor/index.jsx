import Footer from '../../components/footer'
import VideoPlayer from '../../components/video-player'
import VideoSettings from '../../components/video-settings'
import { VideoProvider } from '../../context/video'

export default function VideoEditor() {
  return (
    <VideoProvider>
      <VideoPlayer />
      <VideoSettings />
      <Footer />
    </VideoProvider>
  )
}
