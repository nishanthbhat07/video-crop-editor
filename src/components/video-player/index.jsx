import './styles.css'
import StaticVideo from '../../assets/videos/webm.mp4'
import { useVideoContext } from '../../context/video'
import { useEffect, useRef, useState } from 'react'

export default function VideoPlayer() {
  const {
    videoRef,
    videoDimensions,
    aspectRatio,
    previewRef,
    handleTimeUpdate,
  } = useVideoContext()

  const cropperRef = useRef(null)
  const containerRef = useRef(null)

  const [cropperState, setCropperState] = useState(() => {
    const height = videoDimensions.height
    const width = height * aspectRatio
    return {
      top: 0,
      left: (videoDimensions.width - width) / 2,
      width,
      height,
    }
  })

  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)

  const handleDragStart = e => {
    setDragging(true)
    e.preventDefault()
  }

  const handleDrag = e => {
    if (!dragging) return

    setCropperState(prev => {
      const newTop = Math.max(0, prev.top + e.movementY)
      const newLeft = Math.max(0, prev.left + e.movementX)
      const maxLeft = videoRef.current.offsetWidth - prev.width
      const maxTop = videoRef.current.offsetHeight - prev.height

      return {
        ...prev,
        top: Math.min(newTop, maxTop),
        left: Math.min(newLeft, maxLeft),
      }
    })
  }

  const handleDragEnd = () => setDragging(false)

  const handleResizeMouseDown = e => {
    e.stopPropagation()
    setResizing(true)
    setCropperState(prev => ({
      ...prev,
      resizeStart: {
        x: e.clientX,
        y: e.clientY,
        width: prev.width,
        height: prev.height,
      },
    }))
  }

  const handleResize = e => {
    if (!resizing) return

    setCropperState(prev => {
      const dx = e.clientX - prev.resizeStart.x

      const newWidth = Math.max(50, prev.resizeStart.width + dx)
      const newHeight = newWidth / aspectRatio

      const maxWidth = videoRef.current.offsetWidth - prev.left
      const maxHeight = videoRef.current.offsetHeight

      if (newHeight > maxHeight) {
        return {
          ...prev,
          width: maxHeight * aspectRatio,
          height: maxHeight,
        }
      }

      return {
        ...prev,
        width: Math.min(newWidth, maxWidth),
        height: newHeight,
      }
    })
  }

  const handleResizeEnd = () => setResizing(false)

  useEffect(() => {
    const { top, left } = cropperState

    if (previewRef.current && videoRef.current) {
      const videoWidth = videoRef.current.videoWidth
      const videoHeight = videoRef.current.videoHeight
      const scaleX = videoWidth / videoRef.current.offsetWidth
      const scaleY = videoHeight / videoRef.current.offsetHeight

      previewRef.current.style.objectPosition = `${-left * scaleX}px ${-top * scaleY}px`
      previewRef.current.style.width = `${videoWidth}px`
      previewRef.current.style.height = `${videoHeight}px`
    }
  }, [cropperState])

  useEffect(() => {
    if (videoRef.current) {
      const videoHeight = videoRef.current.offsetHeight
      const newWidth = videoHeight * aspectRatio

      setCropperState(prev => ({
        ...prev,
        height: videoHeight,
        width: newWidth,
        left: Math.max(0, (videoRef.current.offsetWidth - newWidth) / 2),
      }))
    }
  }, [aspectRatio, videoDimensions])

  return (
    <div className="outer-container">
      <div
        className="video-player-container"
        ref={containerRef}
        onMouseMove={e => {
          if (dragging) handleDrag(e)
          if (resizing) handleResize(e)
        }}
        onMouseUp={() => {
          handleDragEnd()
          handleResizeEnd()
        }}
        onMouseLeave={() => {
          handleDragEnd()
          handleResizeEnd()
        }}
      >
        <video
          ref={videoRef}
          crossOrigin="anonymous"
          className="video-player"
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={StaticVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className="cropper"
          ref={cropperRef}
          onMouseDown={handleDragStart}
          style={{
            top: cropperState.top,
            left: cropperState.left,
            width: cropperState.width,
            height: cropperState.height,
            aspectRatio: aspectRatio,
          }}
        >
          <div className="grid-lines">
            <div className="grid-line vertical" style={{ left: '33.33%' }} />
            <div className="grid-line vertical" style={{ left: '66.66%' }} />
            <div className="grid-line horizontal" style={{ top: '33.33%' }} />
            <div className="grid-line horizontal" style={{ top: '66.66%' }} />
          </div>

          <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
        </div>
      </div>
      {/* Video Preview */}
      <div
        className="preview-container"
        style={{
          height: videoRef.current?.offsetHeight || 'auto',
          aspectRatio: aspectRatio,
        }}
      >
        <video
          ref={previewRef}
          className="preview-player"
          crossOrigin="anonymous"
          muted
          loop
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
        >
          <source src={StaticVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="preview-mask" />
      </div>
    </div>
  )
}
