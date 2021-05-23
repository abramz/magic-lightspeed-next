/* https://github.com/GRVYDEV/Lightspeed-react/blob/master/src/App.js */
import React from 'react'
import { useRTC } from './rtcPeerContext'
import { useSocket } from './socketContext'

type State = {
  stream: MediaStream | null
  viewers: number | null
}

interface Action {
  type: string
}
interface InitStreamAction extends Action {
  stream: MediaStream
}
interface InfoAction extends Action {
  viewers: number
}

export type Context = {
  initializeStream: () => void
} & State

export const StreamContext = React.createContext<Context | undefined>(undefined)

const streamReducer = (
  state: State,
  action: InitStreamAction | InfoAction | Action
) => {
  switch (action.type) {
    case 'initStream': {
      return { ...state, stream: (action as InitStreamAction).stream }
    }
    case 'info': {
      return { ...state, viewers: (action as InfoAction).viewers }
    }

    default: {
      return { ...state }
    }
  }
}

const initialState: State = {
  stream: null,
  viewers: null,
}

const StreamProvider: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = React.useReducer(streamReducer, initialState)
  const { pc } = useRTC()
  const { socket } = useSocket()

  const initializeStream = React.useCallback(() => {
    // Offer to receive 1 audio, and 1 video tracks
    pc.addTransceiver('audio', { direction: 'recvonly' })
    // pc.addTransceiver('video', { 'direction': 'recvonly' })
    pc.addTransceiver('video', { direction: 'recvonly' })

    pc.ontrack = (event) => {
      const {
        track: { kind },
        streams,
      } = event

      if (kind === 'video') {
        dispatch({ type: 'initStream', stream: streams[0] })
      }
    }

    pc.onicecandidate = (e) => {
      const { candidate } = e
      if (candidate) {
        console.log('Candidate success')
        socket.send(
          JSON.stringify({
            event: 'candidate',
            data: e.candidate,
          })
        )
      }
    }

    if (socket) {
      socket.onmessage = async (event) => {
        const msg = JSON.parse(event.data)

        if (!msg) {
          console.log('Failed to parse msg')
          return
        }

        const offerCandidate = msg.data

        if (!offerCandidate) {
          console.log('Failed to parse offer msg data')
          return
        }

        switch (msg.event) {
          case 'offer':
            console.log('Offer')
            pc.setRemoteDescription(offerCandidate)

            try {
              const answer = await pc.createAnswer()
              pc.setLocalDescription(answer)
              socket.send(
                JSON.stringify({
                  event: 'answer',
                  data: answer,
                })
              )
            } catch (e) {
              console.error(e.message)
            }

            return
          case 'candidate':
            console.log('Candidate')
            pc.addIceCandidate(offerCandidate)
            return
          case 'info':
            dispatch({
              type: 'info',
              viewers: msg.data.no_connections,
            })
        }
      }
    }
  }, [pc, socket])

  return (
    <StreamContext.Provider value={{ ...state, initializeStream }}>
      {children}
    </StreamContext.Provider>
  )
}

export const useStream = (): Context => {
  const context = React.useContext(StreamContext)

  if (!context) {
    throw new Error('useStream must be nested in StreamProvider')
  }

  return context
}

export default StreamProvider
