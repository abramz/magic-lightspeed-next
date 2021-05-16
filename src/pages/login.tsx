import React from 'react'
import Router from 'next/router'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { magic } from '../magic'
import { APPLICATION_JSON } from '../constants'
import Page from '../components/Page'
import {
  EMAIL_ERROR_MESSAGE,
  EMAIL_LABEL,
  EMAIL_PLACEHOLDER,
  LOGIN_BUTTON,
} from '../strings/login'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [isLoggingIn, setIsLoggingIn] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const handleLogin = React.useCallback(
    async (event) => {
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

        if (res.ok) {
          Router.push('/')
        } else {
          throw new Error('Not logged in')
        }
      } catch {
        setHasError(true)
      }

      setIsLoggingIn(false)
    },
    [email]
  )

  const handleEmailChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value)
      setHasError(false)
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
            <FormControl id="email" isRequired isInvalid={hasError}>
              <FormLabel>{EMAIL_LABEL}</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={EMAIL_PLACEHOLDER}
              />
              {hasError && (
                <FormErrorMessage>{EMAIL_ERROR_MESSAGE}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              type="submit"
              size="lg"
              isLoading={isLoggingIn}
              colorScheme="teal"
              w="100%"
              mt={3}
            >
              {LOGIN_BUTTON}
            </Button>
          </form>
        </Flex>
      </Flex>
    </Page>
  )
}
