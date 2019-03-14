/**
 * This QueryHelper file will contain all of the necessary queries you'll need to make, but a big word of caution: don't try to make a function within this file. Only declare the queries and
 * then use them in a Query component elsewhere.
 */

 /*
    PRO TIP: Test out your queries frequently in the GraphiQL plugin. It is very useful! That way you can copy the queries straight from there to here excluding the query's header so it will
    automatically run here!
 */

 import gql from 'graphql-tag';

 export const GET_HEADER_DATA = gql `{
    generalSettings {
        headerScripts
        title
    }
}`;

export const GET_FOOTER_SCRIPTS = gql `{
    generalSettings {
        footerScripts
    }
}`;

 export const GET_BLOG_DATA = gql `{
    posts {
        nodes {
            title
            slug
            date
            excerpt
            featuredImage {
                sourceUrl
            }
        }
    }
 }`;

 export const GET_PRODUCE_DATA = gql `{
    posts {
        nodes {
            title
            slug
            excerpt
            featuredImage {
                sourceUrl
            }
        }
    }
 }`;

 export const GET_POST_DATA = gql `
    query Post($postSlug: String!) {
        postBy(slug: $postSlug) {
            title
            date
            modified
            featuredImage {
                sourceUrl
            }
            seoTitle
            seoDescription
        }
    }`;

export const GET_PAGE_DATA = gql `
    query Page($pageSlug: String!) {
        pageBy(uri: $pageSlug) {
            title
            acf
            seoTitle
            seoDescription
        }
    }
`