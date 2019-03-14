import {Query} from 'react-apollo';
import { GET_PRODUCE_DATA } from '../src/util/QueryHelper';
import {PureComponent} from 'react';
import {withRouter} from 'next/router';
import Layout from '../src/components/Layout';

const ProductListing = ({title,slug,excerpt,imgUrl,onClick}) => (
    <div className="product-listing">
        <img src={imgUrl} alt={`Product listing for ${title}`} />
        <div className="content">
            <h3>{title}</h3>
            <p dangerouslySetInnerHTML={{__html: excerpt}}></p>
            <button onClick={onClick}>Read More</button>
        </div>
    </div>
)

class Produce extends PureComponent {

    constructor(props) {
        super(props)
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(slug) {
        const {router} = this.props;
        router.push(`/fruit?slug=${slug}`,`/produce/${slug}`);
    }

    render() {
        return (
            <Layout
                title="Produce Section"
                description="Come get some wonderful produce here!"
            >
                <div id="produce-wrapper">
                    <Query
                        query={GET_PRODUCE_DATA}
                        pollInterval={500} //This allows close to real-time data by checking for new data every 500ms
                    >
                        {({loading,error,data})=>{
                            if(loading) return <p>loading...</p>
                            if(error) return <p>{error.message}</p>

                            let produce = data.fruits.nodes;

                            return (
                                <div id="produce-container" className="p-m-all max-screenWidth">
                                    {produce.length != 0 &&
                                        produce.map(fruit => {
                                            return <ProductListing key={fruit.title} 
                                                        title={fruit.title} 
                                                        slug={fruit.slug} 
                                                        excerpt={fruit.excerpt} 
                                                        imgUrl={fruit.featuredImage.sourceUrl}
                                                        onClick={() => this.handleButtonClick(fruit.slug)}
                                                    />
                                        })
                                    }
                                </div>
                            )
                        }}
                    </Query>
                    <style jsx>{`
                        #produce-container {
                            display: grid;
                            grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
                        }
                    `}</style>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Produce);