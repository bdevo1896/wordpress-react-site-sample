import Layout from '../src/components/Layout';
import {Query} from 'apollo-client';

// const BlogCard
const Blog = () => (
    <Layout
        title="Blog"
        description="This is the blog for a sample site"
    >
        <h1>Blog</h1>
        <p>There will be a couple of posts here, I think??</p>
    </Layout>
)

export default Blog;