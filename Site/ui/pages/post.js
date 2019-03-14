import Layout from '../src/components/Layout';
import {Query} from 'react-apollo';
import {PureComponent} from 'react';
import { GET_POST_DATA } from '../src/util/QueryHelper';

class Post extends PureComponent {
    render() {
        return (
                <Query
                    query={GET_POST_DATA}
                    variables={{postSlug:this.props.postSlug}}
                >
                    {({loading,error,data}) => {
                        if(loading) return <p>loading...</p>
                        if(error) return <p>{error.message}</p>

                        let post = data.postBy;

                        return (
                            <Layout
                                title={post.seoTitle}
                                description={post.seoDescription}
                            >
                                <article className="max-width">
                                    <img className="cover" src={post.featuredImage.sourceUrl} alt={`The featured image for ${post.title}`}/>
                                    <h1 dangerouslySetInnerHTML={{__html: post.title}}></h1>
                                    <small dangerouslySetInnerHTML={{__html: post.date}}></small>
                                    <div className="content" dangerouslySetInnerHTML={{__html: post.content}}></div>
                                </article>
                            </Layout>
                        )
                    }}
                </Query>
        )
    }
}

Post.getInitialProps = async function (context) {
    const {slug} = context.query;
    let postSlug = slug;
    return {postSlug};
}

export default Post;