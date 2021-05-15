import React from 'react'
import Router from 'next/router'
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { magic } from '../magic'
import { APPLICATION_JSON } from '../constants'
import Page from '../components/Page'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [isLoggingIn, setIsLoggingIn] = React.useState(false)

  const handleLogin = React.useCallback(async () => {
    event.preventDefault()

    if (!email) {
      return
    }

    try {
      setIsLoggingIn(true)

      const checkEmailRes = await fetch(`/api/checkEmail?email=${email}`, {
        headers: { 'Content-Type': APPLICATION_JSON },
      })

      if (!checkEmailRes.ok) {
        throw new Error('Not allowed')
      }

      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/callback', window.location.origin).href,
      })

      const res = await fetch('/api/login', {
        headers: {
          'Content-Type': APPLICATION_JSON,
          Authorization: 'Bearer ' + didToken,
        },
      })

      res.ok && Router.push('/')
    } catch (error) {
      setIsLoggingIn(false)
    }
  }, [email])

  const handleEmailChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value)
    },
    []
  )

  return (
    <Page>
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Flex
          borderRadius="md"
          boxShadow="md"
          w={['80vh', '70vh', '50vh', '50vh', '50vh']}
          px={4}
          py={3}
        >
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                colorScheme="teal"
              />
            </FormControl>
            <Button
              type="submit"
              size="lg"
              isLoading={isLoggingIn}
              colorScheme="teal"
              w="100%"
              mt={3}
            >
              Login
            </Button>
          </form>
        </Flex>
      </Flex>
    </Page>
  )
}
