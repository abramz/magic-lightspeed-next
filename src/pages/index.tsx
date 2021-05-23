import React from 'react'
import dynamic from 'next/dynamic'
import Page from 'src/components/Page'

const DynamicStream = dynamic(() => import('src/components/Stream'), {
  ssr: false,
})

export const Index: React.FunctionComponent = () => (
  <Page requiresLogin>
    <DynamicStream />
  </Page>
)

export default Index
