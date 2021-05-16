import React from 'react'
import Router from 'next/router'
import { magic } from 'src/utils/magic'
import Page from 'src/components/Page'

export default function Callback() {
  React.useEffect(() => {
    magic.auth
      .loginWithCredential()
      .then(async (didToken) => {
        const res = await fetch('/api/login', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + didToken,
          },
        })

        if (res.ok) {
          Router.push('/')
        } else {
          Router.push('/login')
        }
      })
      .catch(() => Router.push('/login'))
  }, [])

  return <Page isLoading>Boop</Page>
}
