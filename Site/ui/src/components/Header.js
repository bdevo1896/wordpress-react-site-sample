import Head from 'next/head';
import {Fragment,PureComponent} from 'react';
import {Query} from 'react-apollo';
import {GET_HEADER_DATA} from '../util/QueryHelper';
import Navigation from './Navigation';

//It can be hard implementing third party scripts, or at least allowing your clients to be able to do it. Here is the workaround I found:
class Header extends PureComponent {
    render() {
        const {title,description,keywords} = this.props;
        
        return (
            <Fragment>
                <Query query={GET_HEADER_DATA}>
                    {({loading,error,data}) => {
                        if(loading) return <p>We are loading...</p>
                        if(error) return <p>{error.message}</p>
            
                        const scripts = data.generalSettings.headerScripts;
                        const siteTitle = data.generalSettings.title;
            
                        return (
                            <Fragment>
                                <Head>
                                    <title>{`${title} | ${siteTitle}`}</title>
                                    <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                                    <meta name="description" content={description}/>
                                    <meta name="theme-color" content="#474c4b"/>
                                    <link rel="manifest" href="/static/manifest.json" />
                                </Head>
                                <head dangerouslySetInnerHTML={{__html:scripts}}></head>
                            </Fragment>
                        )
                    }}
                </Query>
                <Navigation />
            </Fragment>
        )
    }
}

export default Header;