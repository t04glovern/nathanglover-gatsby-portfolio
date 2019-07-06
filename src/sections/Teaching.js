import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'rebass';
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

const Course = ({ title, image, url, price }) => (
  <Card onClick={() => window.open(url, '_blank')} pb={4}>
    <EllipsisHeading m={3} p={1}>
      {title}
    </EllipsisHeading>
    {image && <CoverImage src={image} height="200px" alt={title} />}
    <ImageSubtitle bg="primaryLight" color="white" x="right" y="bottom" round>
      {`${price}`}
    </ImageSubtitle>
  </Card>
);

Course.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

const parseCourse = courseFromGraphql => {
  const UDEMY_URL = 'https://udemy.com';
  const {
    id,
    title,
    url,
    price,
    // eslint-disable-next-line camelcase
    image_480x270,
  } = courseFromGraphql;
  // eslint-disable-next-line camelcase
  const image = image_480x270;
  return {
    id,
    title,
    image,
    url: `${UDEMY_URL}${url}`,
    price,
  };
};

const edgeToArray = data => data.edges.map(edge => edge.node);

const Teaching = () => (
  <StaticQuery
    query={graphql`
      query UdemyCourseQuery {
        allUdemyCourse {
          edges {
            node {
              id
              title
              url
              price
              image_480x270
            }
          }
        }
      }
    `}
    render={({ allUdemyCourse }) => {
      const courses = edgeToArray(allUdemyCourse).map(parseCourse);
      return (
        <Section.Container id="teaching" Background={Background}>
          <Section.Header name="Teaching" icon="✍️" label="teaching" />
          <CardContainer minWidth="300px">
            {courses.map(p => (
              <Fade bottom>
                <Course key={p.id} {...p} />
              </Fade>
            ))}
          </CardContainer>
        </Section.Container>
      );
    }}
  />
);

export default Teaching;
