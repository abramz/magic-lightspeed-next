import type { MagicUserMetadata } from 'magic-sdk'
import React from 'react'
import Router from 'next/router'

export type Context = {
  userMetadata: MagicUserMetadata
  getUser: () => void
  logout: () => void
}

const UserContext = React.createContext<Context | undefined>(undefined)

/**
 * Provides
 *   - user metadata, if it exsits,
 *   - a method to get the user metatdata, and
 *   - a method to log out the user
 */
export const UserProvider: React.FC = ({ children }) => {
  const [userMetadata, setUserMetadata] =
    React.useState<MagicUserMetadata | undefined>()
  const [, setError] = React.useState<Error | undefined>()

  /**
   * Fetch the user & if it is not or cannot be retrieved, redirect to the login page
   */
  const getUser = React.useCallback(async () => {
    const response = await fetch('/api/user')

    try {
      if (response.ok) {
        const data = await response.json()

        if (data.user) {
          setUserMetadata(data.user)

          return
        }
      }
    } catch (error) {
      setError(error)
    }

    Router.push('/login')
  }, [])
  /**
   * Log the user out
   */
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

/**
 * Use the user context
 *
 * @returns the user context
 */
export function useUser(): Context {
  const context = React.useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
