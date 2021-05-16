import React from 'react'
import { Flex } from '@chakra-ui/layout'
import { useUser } from 'src/hooks/userContext'
import Loading from 'src/components/Loading'

export type PageProps = {
  requiresLogin?: boolean
  isLoading?: boolean
}

export default function Page({
  requiresLogin = false,
  isLoading = false,
  children,
}): React.ReactElement | null {
  const { getUser, userMetadata } = useUser()

  React.useEffect(() => {
    if (requiresLogin) {
      getUser()
    }
  }, [])

  return (
    <Flex flexDir="column" alignItems="stretch" h="100vh">
      {isLoading || (requiresLogin && !userMetadata) ? <Loading /> : children}
    </Flex>
  )
}
