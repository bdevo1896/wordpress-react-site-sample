import {PureComponent} from 'react';
import {Query} from 'react-apollo';
import {GET_FRUIT_DATA} from '../src/util/QueryHelper';
import Layout from '../src/components/Layout';


class Fruit extends PureComponent {

    render() {
        const {fruitSlug} = this.props;
        console.log(fruitSlug);
        return (
            <Query
                query={GET_FRUIT_DATA}
                variables={{fruitSlug:fruitSlug}}
            >
                {({loading,error,data})=>{
                    if(loading) return loading;
                    if(error) return <p>{error.message}</p>;

                    let fruit = data.fruitBy;

                    return (
                        <Layout
                            title={fruit.seoTitle}
                            description={fruit.seoDescription}
                        >
                            <div id="fruit-container">
                                <h1>{fruit.title}</h1>
                                <img src={fruit.featuredImage.sourceUrl} alt={`The ${fruit.title} in all of its glory!`}/>
                                <div className="content" dangerouslySetInnerHTML={{__html:fruit.content}}></div>
                            </div>
                        </Layout>
                    )
                }}
            </Query>
        )
    }
}

Fruit.getInitialProps = async function (context) {
    const {slug} = context.query;
    let fruitSlug = slug;
    return {fruitSlug};
}

export default Fruit;