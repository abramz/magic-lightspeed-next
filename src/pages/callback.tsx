import React from 'react'
import Router from 'next/router'
import { magic } from '../magic'
import Page from '../components/Page'

export default function Callback() {
  React.useEffect(() => {
    magic.auth.loginWithCredential().then(async (didToken) => {
      const res = await fetch('/api/login', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
      })
      res.ok && Router.push('/')
    })
  }, [])

  return <Page isLoading>Boop</Page>
}
