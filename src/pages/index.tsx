import React from 'react'
import dynamic from 'next/dynamic'
import Page from 'src/components/Page'
import { Center } from '@chakra-ui/layout'

const DynamicStream = dynamic(() => import('src/components/Stream'), {
  ssr: false,
})

export const Index: React.FunctionComponent = () => (
  <Page requiresLogin>
    <Center h="100%" w="60vw" m="auto">
      <DynamicStream />
    </Center>
  </Page>
)

export default Index
