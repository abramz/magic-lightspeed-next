import type { MagicUserMetadata } from 'magic-sdk'
import React from 'react'
import Router from 'next/router'
import { magic } from '../magic'

export type Context = {
  userMetadata: MagicUserMetadata
  getUser: () => void
  logout: () => void
}

const UserContext = React.createContext<Context | undefined>(undefined)

export function UserProvider({ children }) {
  const [userMetadata, setUserMetadata] =
    React.useState<MagicUserMetadata | undefined>()
  const getUser = React.useCallback(async () => {
    const response = await fetch('/api/user')

    if (response.ok) {
      const data = await response.json()

      if (data.user) {
        setUserMetadata(data.user)

        return
      }
    }

    Router.push('/login')
  }, [])
  const logout = React.useCallback(async () => {
    await fetch('/api/logout')

    Router.push('/login')
  }, [])

  return (
    <UserContext.Provider value={{ userMetadata, getUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = React.useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
