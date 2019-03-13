import App from 'next/app'
import React from 'react'
import withApolloClient from '../src/util/withApolloClient'
import { ApolloProvider } from 'react-apollo'
import '../src/dist/css/styles.css';
import OfflineSupport from '../src/components/OfflineSupport';
/*
    Anything that you render here, will be shown on every page. This means that you should have your navigation
    declared and instantiated here so that it will show on every page.
*/
class MyApp extends App {
  
  constructor(props) {
    super(props);
  }

  render () {
    const { Component, pageProps, apolloClient } = this.props;
    return (
        <ApolloProvider client={apolloClient}>
            <OfflineSupport />
            <Component 
              {...pageProps} 
            />
      </ApolloProvider>
    )
  }
}

export default withApolloClient(MyApp)