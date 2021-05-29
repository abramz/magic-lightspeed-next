import React from 'react'
import { AspectRatio } from '@chakra-ui/react'
import RTCProvider from 'src/hooks/rtcPeerContext'
import SocketProvider from 'src/hooks/socketContext'
import StreamProvider, { useStream } from 'src/hooks/streamContext'

export const Stream: React.FunctionComponent = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const initialized = React.useRef<boolean>(false)
  const { initializeStream, canInitialize, stream } = useStream()

  if (canInitialize && !initialized.current) {
    initialized.current = true
    console.log('initializing the stream')
    initializeStream()
  }

  React.useEffect(() => {
    videoRef.current.srcObject = stream
  }, [stream])

  return (
    <AspectRatio w="100%" ratio={16 / 9}>
      <video
        ref={videoRef}
        playsInline
        autoPlay
        controls
        poster="/videoPoster.jpg"
      />
    </AspectRatio>
  )
}

const StreamProviders: React.FunctionComponent = () => (
  <RTCProvider>
    <SocketProvider>
      <StreamProvider>
        <Stream />
      </StreamProvider>
    </SocketProvider>
  </RTCProvider>
)

export default StreamProviders
