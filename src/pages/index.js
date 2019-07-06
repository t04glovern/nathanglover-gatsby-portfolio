import React from 'react';
import Layout from '../components/Layout';
import Landing from '../sections/Landing';
import About from '../sections/About';
import Blogging from '../sections/Blogging';
import Projects from '../sections/Projects';
import Teaching from '../sections/Teaching';
import Header from '../components/Header';
import Footer from '../components/Footer';

const IndexPage = () => (
  <Layout>
    <Header />
    <Landing />
    <About />
    <Projects />
    <Blogging />
    <Teaching />
    <Footer />
  </Layout>
);

export default IndexPage;
