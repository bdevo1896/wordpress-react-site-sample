const { join } = require('path');
const express = require('express');
const next = require('next');
const cache = require('lru-cache'); // for using least-recently-used based caching
// const favicon = require('serve-favicon')
const path = require('path')
const bodyParser = require('body-parser');
const sm = require('sitemap');
const { ApolloClient, HttpLink, InMemoryCache} = require('apollo-boost');
const fetch = require('isomorphic-unfetch');
const gql = require('graphql-tag');

//Change this to whatever graphql API you're using for the dev environment
const DEV_API = 'http://localhost:4000/graphql';

//This is whatever will be the graphql API you're using at production
const API = 'https://admin.example.com/graphql';

const PORT = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const ssrCache = new cache({
  max: 20, // not more than 20 results will be cached
  maxAge: 1000 * 60 * 5, // 5 mins
});

const client = new ApolloClient({
  link: new HttpLink({
    uri: dev ? DEV_API : API,
    // uri: 'https://example.com/graphql',
    credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
  }),
  cache: new InMemoryCache()
})

app.prepare().then(() => {
  const server = express();
  
  server.enable('trust proxy')
  // if(!dev) {
  //   server.use(function(req, res, next) {
  //     var schema = req.headers['x-forwarded-proto'];
    
  //     if (schema === 'https') {
  //       // Already https; don't do anything special.
  //       next();
  //     }
  //     else {
  //       // Redirect to https.
  //       res.redirect('https://' + req.headers.host + req.url);
  //     }
  //   });
  // }
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(bodyParser.json())

  //automatically fetching and caching home page. You will have to declare each page that is declared separately
  server.get('/', (req, res) => {
    renderAndCache(req, res, '/');
  });

  server.get('/blog', (req, res) => {
    renderAndCache(req, res, '/blog');
  });

  server.get('/sample', (req, res) => {
    renderAndCache(req, res, '/sample');
  });

  //Fetching and caching the post. This is done dynamically. By knowing what the url will look like, we only need the slug to ensure it is cached properly. If this isn't done, you will get a 200 error wehn the app is offline
  server.get('/blog/:slug', (req, res) => {
    renderAndCache(req, res, '/blog/'+req.params.slug); 
    app.render(req, res, '/post', req.params)
  })

  //Here is how you can create a robots.txt
  server.get('/robots.txt', (req,res) => {
    res.type('text/plain')
    res.send(`
      User-agent: *
      \nDisallow: /fruit
      \nDisallow: /post
      `)
  });

  /* Make a sitemap on the fly with a cache time of 10 minutes. the url and lastMOD values will be populated so we need to fetch the slug and last modified time (in WPGraphQl this is instantiated as
     'modified' in the schema of posts and pages).
     
     Note: the modified returns the date in this format - YYYY-MM-DD hh:mm:ss ; this is not going to work for lastMOD which needs to be in the W3C Date format - YYYY-MM-DDThh:mm:ssZ (Z is the timezone e.g. -06:00 is the Central Time Zone)
     In 'modifyTime' function we replace the space with 'T' and add my timezone to the end of the string.
     Ex:

     modified = 2019-03-12 15:30:15

     lastMOD = 2019-03-12T15:30:15-06:00
  */
  server.get('/sitemap.xml',(req,res) => {

    client
      .query({
        query: gql `
          {
            posts {
              nodes {
                slug
                modified
              }
            }
            pages {
              nodes {
                slug
                modified
              }
            }

            fruits {
              nodes {
                slug
                modified              
              }
            }
          }
        `
      }).then(result => {
          let posts = result.data.posts.nodes;
          let pages = result.data.pages.nodes;

          let sitemap = sm.createSitemap({
            hostname: `https://${HOST}`,
            cacheTime: 600000,
          })

          
          pages.forEach(el => {
            if(el.slug=='home') {
              sitemap.add({url:'/',lastmodISO:modifyTime(el.modified)})
            }else {
              sitemap.add({url:el.slug,lastmodISO:modifyTime(el.modified)})
            }
          })

          //Use this if your blog page is created in the pages folder and not in the CMS backend
          sitemap.add({url:'/blog',lastmodISO:modifyTime(pages[0].modified)});

          //Dynamically adding the fetched posts
          posts.forEach(el => sitemap.add({url:'/blog/'+el.slug,lastmodISO:modifyTime(el.modified)}));

          sitemap.toXML( function (err, xml) {
            if (err) {
              return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send( xml );
          });
      })
  })
  
  server.get('*', (req, res) => {
    if (req.url.includes('/sw')) {
      const filePath = join(__dirname, 'static', 'workbox', 'sw.js');
      app.serveStatic(req, res, filePath);
    } else if (req.url.startsWith('static/workbox/')) {
      app.serveStatic(req, res, join(__dirname, req.url));
    } else {
      handle(req, res, req.url);
    }
  });

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Live @ https://localhost:${PORT}`);
  });
});

async function renderAndCache(req, res, pagePath, queryParams) {
  const key = req.url;

  // if page is in cache, server from cache
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  try {
    // if not in cache, render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams);

    // if something wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html);
      return;
    }

    ssrCache.set(key, html);

    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams);
  }
}

function modifyTime(time) {
  let newStr = time.replace(' ','T');
  newStr += '-06:00';//My timezone for the site map
  return newStr;
}