import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Text } from 'rebass';
import { StaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import Fade from 'react-reveal/Fade';
import Section from '../components/Section';
import { CardContainer, Card } from '../components/Card';
import Triangle from '../components/Triangle';
import ImageSubtitle from '../components/ImageSubtitle';

const Background = () => (
  <div>
    <Triangle
      color="backgroundDark"
      height={['15vh', '10vh']}
      width={['100vw', '100vw']}
      invertX
    />

    <Triangle
      color="secondary"
      height={['50vh', '40vh']}
      width={['70vw', '40vw']}
      invertY
    />

    <Triangle
      color="primaryDark"
      height={['40vh', '15vh']}
      width={['100vw', '100vw']}
      invertX
      invertY
    />
  </div>
);

const CoverImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

const EllipsisHeading = styled(Heading)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-inline-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  border-bottom: ${props => props.theme.colors.primary} 5px solid;
`;

const convertUnicode = input => {
  return input
    .replace('&#8211;', '-')
    .replace('&#038;', '/')
    .replace('&#8217;', "'")
    .replace('<p>', '')
    .replace('</p>', '');
};

const Post = ({ title, text, image, url, date }) => (
  <Card onClick={() => window.open(url, '_blank')} pb={4}>
    <EllipsisHeading m={3} p={1}>
      {convertUnicode(title)}
    </EllipsisHeading>
    {image && (
      <CoverImage src={image} height="200px" alt={convertUnicode(title)} />
    )}
    <Text m={3}>{convertUnicode(text)}</Text>
    <ImageSubtitle bg="primaryLight" color="white" x="right" y="bottom" round>
      {`${date}`}
    </ImageSubtitle>
  </Card>
);

Post.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

const parsePost = postFromGraphql => {
  const {
    id,
    excerpt,
    date,
    title,
    // eslint-disable-next-line camelcase
    jetpack_featured_media_url,
    link,
  } = postFromGraphql;
  return {
    id,
    title,
    date,
    text: excerpt,
    image: jetpack_featured_media_url,
    url: link,
  };
};

const edgeToArray = data => data.edges.map(edge => edge.node);

const Blogging = () => (
  <StaticQuery
    query={graphql`
      {
        allWordpressPost(limit: 8, sort: { fields: date, order: DESC }) {
          edges {
            node {
              id
              excerpt
              date(formatString: "DD MMM YYYY")
              title
              jetpack_featured_media_url
              link
            }
          }
        }
      }
    `}
    render={({ allWordpressPost }) => {
      const posts = edgeToArray(allWordpressPost).map(parsePost);
      return (
        <Section.Container id="blogging" Background={Background}>
          <Section.Header name="Blogging" icon="✍️" label="blogging" />
          <CardContainer minWidth="300px">
            {posts.map(p => (
              <Fade bottom>
                <Post key={p.id} {...p} />
              </Fade>
            ))}
          </CardContainer>
        </Section.Container>
      );
    }}
  />
);

export default Blogging;
