import { createContext, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export const VideoContext = createContext()

export const VideoProvider = ({ children }) => {
  // Refs
  const videoRef = useRef(null)
  const previewRef = useRef(null)

  // States
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [videoDimensions, setVideoDimensions] = useState({
    width: 100,
    height: 100,
  })
  const [aspectRatio, setAspectRatio] = useState(16 / 9)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Functions
  const handleMouseMove = e => {
    if (isDragging) {
      const progressBar = document.querySelector('.progress-bar')
      const rect = progressBar.getBoundingClientRect()
      const pos = Math.min(Math.max(0, (e.pageX - rect.left) / rect.width), 1)
      videoRef.current.currentTime = pos * videoRef.current.duration
    }
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseDown = () => setIsDragging(true)

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play()
      previewRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      previewRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleTimeUpdate = () => {
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    const progressBar = document.querySelector('.progress-filled')
    const progressHandle = document.querySelector('.progress-handle')

    if (progressBar) {
      setCurrentTime(videoRef.current.currentTime)
      progressBar.style.width = `${progress}%`
      if (progressHandle) {
        progressHandle.style.left = `${progress}%`
      }
    }
  }

  const handlePlaybackRate = rate => {
    videoRef.current.playbackRate = rate
    previewRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const handleProgress = e => {
    const progressBar = e.currentTarget
    const pos = (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth
    videoRef.current.currentTime = pos * videoRef.current.duration
  }

  const handleAspectRatioChange = newRatio => {
    setAspectRatio(newRatio)
  }

  // Effects
  useEffect(() => {
    const handleSpaceBar = e => {
      if (e.code === 'Space') {
        togglePlay()
      }
    }

    const video = videoRef.current
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight,
      })
    }

    document.addEventListener('keyup', handleSpaceBar)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      document.removeEventListener('keyup', handleSpaceBar)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const contextValue = {
    videoRef,
    previewRef,
    isPlaying,
    playbackRate,
    isDragging,
    videoDimensions,
    aspectRatio,
    currentTime,
    duration,
    handleMouseMove,
    handleMouseUp,
    handlePlaybackRate,
    handleProgress,
    handleAspectRatioChange,
    handleMouseDown,
    togglePlay,
    handleTimeUpdate,
  }

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  )
}

VideoProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useVideoContext = () => useContext(VideoContext)
