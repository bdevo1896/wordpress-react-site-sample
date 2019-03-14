import Layout from '../src/components/Layout';
import { Query } from 'react-apollo';
import {GET_PAGE_DATA} from '../src/util/QueryHelper';
import {convertACFToJSON} from '../src/util/AppHelper';
import {Fragment} from 'react';

const Home = () => (
    <Layout
        title="Home"
        description="This is the home for a sample site"
    >
    <Query
        query={GET_PAGE_DATA}
        variables={{pageSlug: "home-page"}}
    >
        {({loading,error,data}) => {
            if(loading) return <p>Loading...</p>
            if(error) return <p>{error.message}</p>

            const pageData = data.pageBy;

            convertACFToJSON(pageData)

            const banner = pageData.acf.main_banner;

            return (
                <Fragment>
                    <div id="main-banner" className="vbox">
                        <h1 className="m-s-all" dangerouslySetInnerHTML={{__html: banner.main_heading}}></h1>
                        <h2 className="m-s-all" dangerouslySetInnerHTML={{__html: banner.sub_heading}}></h2>
                        <img className="m-s-all" src={banner.image} alt="This is the sample site home page banner featuring the wonderful host from the Mango Nerd!"/>
                        <button className="m-s-all" onClick={() => window.location.href = `${banner.button.link}`}>{banner.button.text}</button>
                    </div>
                </Fragment>
            )
        }}
    </Query>
    <style jsx>{`
        #main-banner img {
            object-fit: contain;
            width: 500px;
            height: auto;
        }
    `}</style>
    </Layout>
)

export default Home;