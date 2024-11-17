import { useVideoContext } from '../../context/video'
import './styles.css'
import speakerIcon from '../../assets/icons/speaker.svg'
import { FaPause, FaPlay } from 'react-icons/fa'

const formatTime = timeInSeconds => {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const playbackOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
]

const cropperAspectRatioOptions = [
  { value: 9 / 18, label: '9:18' },
  { value: 9 / 16, label: '9:16' },
  { value: 4 / 3, label: '4:3' },
  { value: 3 / 4, label: '3:4' },
  { value: 1, label: '1:1' },
  { value: 4 / 5, label: '4:5' },
]

function VideoSettings() {
  const {
    isPlaying,
    togglePlay,
    handleProgress,
    handleMouseDown,
    duration,
    handleAspectRatioChange,
    playbackRate,
    handlePlaybackRate,
    videoRef,
    aspectRatio,
    currentTime,
  } = useVideoContext()

  return (
    <div className="video-settings-container">
      <div className="controls">
        {isPlaying ? (
          <FaPause color="var(--white)" onClick={togglePlay} />
        ) : (
          <FaPlay color="var(--white)" onClick={togglePlay} />
        )}

        <div
          className="progress-bar"
          onClick={handleProgress}
          onMouseDown={handleMouseDown}
        >
          <div className="progress-filled"></div>
          <div className="progress-handle"></div>
        </div>
      </div>

      <div className="playback-rate-container">
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span className="time-separator"></span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="volume-control-container">
          <img src={speakerIcon} alt="speaker" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            color="var(--white)"
            defaultValue="1"
            onChange={e => (videoRef.current.volume = e.target.value)}
            className="volume-control"
          />
        </div>
      </div>
      <div className="settings-controls">
        <select
          value={playbackRate}
          onChange={e => handlePlaybackRate(parseFloat(e.target.value))}
        >
          {playbackOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.value === playbackRate
                ? `Playback Rate ${option.label}`
                : option.label}
            </option>
          ))}
        </select>
        <select
          value={aspectRatio}
          onChange={e => handleAspectRatioChange(parseFloat(e.target.value))}
        >
          {cropperAspectRatioOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.value === aspectRatio
                ? `Cropper Aspect Ratio ${option.label}`
                : option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default VideoSettings
