import { useVideoContext } from '../../context/video'
import './styles.css'

function Footer() {
  const {
    recordings,
    isRecording,
    startRecording,
    stopRecording,
    downloadRecordings,
    handleCancel,
  } = useVideoContext()

  return (
    <div className="footer">
      <div>
        {!isRecording ? (
          <button onClick={startRecording}>Start Cropper</button>
        ) : (
          <button onClick={stopRecording}>Remove Cropper</button>
        )}
        <button onClick={downloadRecordings} disabled={!recordings.length}>
          Generate Preview
        </button>
      </div>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}

export default Footer
