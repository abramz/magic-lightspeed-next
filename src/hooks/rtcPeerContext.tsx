/* https://github.com/GRVYDEV/Lightspeed-react/blob/master/src/context/RTCPeerContext.jsx */
import React from 'react'

export type Context = { pc: RTCPeerConnection }

export const RTCContext = React.createContext<Context | undefined>(undefined)

const RTCProvider: React.FunctionComponent = ({ children }) => {
  const [pc] = React.useState(new RTCPeerConnection())

  const value: Context = { pc }

  return <RTCContext.Provider value={value}>{children}</RTCContext.Provider>
}

export const useRTC = (): Context => {
  const context = React.useContext(RTCContext)

  if (!context) {
    throw new Error('useRTC must be nested in RTCProvider')
  }

  return context
}

export default RTCProvider
