import React from 'react'
import { AspectRatio } from '@chakra-ui/react'
import RTCProvider from 'src/hooks/rtcPeerContext'
import SocketProvider from 'src/hooks/socketContext'
import StreamProvider, { useStream } from 'src/hooks/streamContext'

export const Stream: React.FunctionComponent = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const initialized = React.useRef<boolean>(false)
  const { initializeStream, stream } = useStream()

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      initializeStream()
    }
  }, [initializeStream])

  React.useEffect(() => {
    videoRef.current.srcObject = stream
  }, [stream])

  return (
    <AspectRatio>
      <video ref={videoRef} playsInline autoPlay controls />
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
