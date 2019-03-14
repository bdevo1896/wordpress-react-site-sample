import {Query} from 'react-apollo';
import { GET_PRODUCE_DATA } from '../src/util/QueryHelper';
import {PureComponent} from 'react';
import {withRouter} from 'apollo-client';

const ProductListing = ({title,slug,excerpt,imgUrl}) => (
    <div className="product-listing">
        <img src={imgUrl} alt={`Product listing for ${title}`} />
        <div className="content">
            <h3>{title}</h3>
            <p>{excerpt}</p>
            <button>Read More</button>
        </div>
    </div>
)

class Produce extends PureComponent {
    render() {
        return (
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
                            <div id="produce-container" className="p-m-all">
                                {produce.length != 0 &&
                                    produce.map(fruit => {
                                        return <ProductListing key={fruit.title} title={fruit.title} slug={fruit.slug} excerpt={fruit.excerpt} imgUrl={fruit.featureImage.sourceUrl}/>
                                    })
                                }
                            </div>
                        )
                    }}
                </Query>
                <style jsx>{`
                    #produce-container {
                        display: grid;
                        grid-template-columns: repeat(auto-fit,minmax(1fr,200px));
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(Produce);