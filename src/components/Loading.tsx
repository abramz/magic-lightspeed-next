import React from 'react'
import { Flex, CircularProgress } from '@chakra-ui/react'

export default function Loading() {
  return (
    <Flex h="100vh" alignItems="center" justifyContent="center">
      <CircularProgress
        thickness="4px"
        size="100px"
        color="teal.500"
        isIndeterminate
      />
    </Flex>
  )
}
