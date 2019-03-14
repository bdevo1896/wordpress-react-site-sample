import Layout from '../src/components/Layout';
import {Query} from 'react-apollo';
import { GET_BLOG_DATA } from '../src/util/QueryHelper';
import {withRouter} from 'next/router';
import {PureComponent} from 'react';

const BlogCard = ({title,imgUrl,excerpt,date,onClick}) => (
    <div className="blog-card hbox" onClick={onClick}>
        <img className="cover" src={imgUrl} alt={`Featured image for ${title}`}/>
        <div className="content vbox p-s-all">
            <h3 dangerouslySetInnerHTML={{__html: title}}></h3>
            <p dangerouslySetInnerHTML={{__html:excerpt}}></p>
            <small dangerouslySetInnerHTML={{__html: date}}></small>
        </div>
        <style jsx>{`
            .blog-card {
                border-bottom: 1px solid #dddd;
                cursor: pointer;
            }

            .blog-card:hover {
                background-color: #eeee;
                transition: background-color 250ms ease-in;
            }

            .blog-card img {
                height: 150px;
                width: 150px;
            }
        `}</style>
    </div>
)

class Blog extends PureComponent {

    constructor(props) {
        super(props)
        this.handleCardClick = this.handleCardClick.bind(this);
    }

    handleCardClick(slug) {
        const {router} = this.props;
        router.push(`/post?slug=${slug}`,`/blog/${slug}`)
    }
    render() {
        return (
            <Layout
            title="Blog"
            description="This is the blog for a sample site"
            >
            <h1>Blog</h1>
            <Query
                query={GET_BLOG_DATA}
            >
                {({loading,error,data}) => {
                    if(loading) return <p>loading...</p>
                    if(error) return <p>{error.message}</p>
    
                    let posts = data.posts.nodes;
                    console.log(posts);
                    return (
                        <div>
                            {posts.length != 0 &&
                                posts.map((post) => {
                                    return (
                                    <BlogCard 
                                        title={post.title}
                                        slug={post.slug}
                                        excerpt={post.excerpt}
                                        imgUrl={post.featuredImage.sourceUrl}
                                        date={post.date}
                                        onClick={() => this.handleCardClick(post.slug)}
                                    />
                                    )
                                })
                            }
                        </div>
                    )
                }}
            </Query>
        </Layout>
        )
    }
}

export default withRouter(Blog);