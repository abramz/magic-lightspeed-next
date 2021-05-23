/* https://github.com/GRVYDEV/Lightspeed-react/blob/master/src/context/SocketContext.jsx */
import React from 'react'

type Timeout = ReturnType<typeof setTimeout> | null

type State = {
  url: string
  socket: WebSocket | null
  wsTimeoutDuration: number
  connectTimeout: Timeout
}

export type Context = { socket: WebSocket }

export const SocketContext = React.createContext<Context | undefined>(undefined)

interface Action {
  type: string
}
interface InitSocketAction extends Action {
  url: string
}
interface UpdateTimeoutAction extends Action {
  timeout: Timeout
}

const socketReducer = (
  state: State,
  action: InitSocketAction | UpdateTimeoutAction | Action
) => {
  switch (action.type) {
    case 'initSocket': {
      return {
        ...state,
        socket: new WebSocket((action as InitSocketAction).url),
        url: (action as InitSocketAction).url,
      }
    }
    case 'renewSocket': {
      let timeout = state.wsTimeoutDuration * 2
      if (timeout > 10000) {
        timeout = 10000
      }
      return {
        ...state,
        socket: new WebSocket(state.url),
        wsTimeoutDuration: timeout,
      }
    }
    case 'updateTimeout': {
      return {
        ...state,
        connectTimeout: (action as UpdateTimeoutAction).timeout,
      }
    }
    case 'clearTimeout': {
      clearTimeout(state.connectTimeout)
      return { ...state }
    }
    case 'resetTimeoutDuration': {
      return { ...state, wsTimeoutDuration: 250 }
    }
    default: {
      return { ...state }
    }
  }
}

const initialState: State = {
  url: '',
  socket: null,
  wsTimeoutDuration: 250,
  connectTimeout: null,
}

const SocketProvider: React.FunctionComponent = ({ children }) => {
  const previouSocket = React.useRef<WebSocket | null>(null)
  const [state, dispatch] = React.useReducer(socketReducer, initialState)

  const { socket, wsTimeoutDuration } = state

  React.useEffect(() => {
    // run once on first render
    ;(async () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL
        if (wsUrl) {
          dispatch({
            type: 'initSocket',
            url: wsUrl,
          })
        } else {
          console.error('websocket URL is invalid')
        }
      } catch (e) {
        console.error(e.message)
      }
    })()
  }, [])

  React.useEffect(() => {
    // run only when the socket has changed
    if (!socket || socket == previouSocket.current) return

    previouSocket.current = socket

    socket.onopen = () => {
      dispatch({ type: 'resetTimeout' })
      dispatch({ type: 'resetTimeoutDuration' })
      console.log('Connected to websocket')
    }

    socket.onclose = (e) => {
      const { reason } = e
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          wsTimeoutDuration / 1000
        )} second. ${reason}`
      )

      const timeout = setTimeout(() => {
        //check if websocket instance is closed, if so renew connection
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          dispatch({ type: 'renewSocket' })
        }
      }, wsTimeoutDuration)

      dispatch({
        type: 'updateTimeout',
        timeout,
      })
    }

    // err argument does not have any useful information about the error
    socket.onerror = () => {
      console.error(`Socket encountered error. Closing socket.`)
      socket.close()
    }
  }, [socket, wsTimeoutDuration])

  const value: Context = {
    socket: state.socket,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

export const useSocket = (): Context => {
  const context = React.useContext(SocketContext)

  if (!context) {
    throw new Error('useSocket must be nested in SocketProvider')
  }

  return context
}

export default SocketProvider
