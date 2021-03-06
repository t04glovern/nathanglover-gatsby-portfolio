const contentful = require('contentful');
const manifestConfig = require('./manifest-config');
require('dotenv').config();

const {
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID,
  GOOGLE_ANALYTICS_ID,
} = process.env;

const client = contentful.createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

const getAboutEntry = entry => entry.sys.contentType.sys.id === 'about';

const plugins = [
  `gatsby-plugin-react-helmet`,
  {
    resolve: 'gatsby-plugin-web-font-loader',
    options: {
      google: {
        families: ['Cabin', 'Open Sans'],
      },
    },
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: manifestConfig,
  },
  `gatsby-plugin-styled-components`,
  {
    resolve: `gatsby-source-contentful`,
    options: {
      spaceId: CONTENTFUL_SPACE_ID,
      accessToken: CONTENTFUL_ACCESS_TOKEN,
    },
  },
  `gatsby-transformer-remark`,
  `gatsby-plugin-offline`,
  {
    resolve: `gatsby-source-udemy`,
    options: {
      courses: ['2057215', '1672824', '1627276', '1572194'],
    },
  },
  {
    resolve: `gatsby-source-dev`,
    options: {
      username: 't04glovern'
    }
  }
];

module.exports = client.getEntries().then(entries => {
  if (GOOGLE_ANALYTICS_ID) {
    plugins.push({
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: GOOGLE_ANALYTICS_ID,
      },
    });
  }

  return {
    plugins,
  };
});
