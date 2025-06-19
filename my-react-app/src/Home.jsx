import React from 'react'
import Header from './Header';
import Landing from './Landing';
import Banner from './Banner';
import Loader from './Loader';
import Test from './Test';
import Video from './Video';
import Footer from './Footer';

function Home() {
  return (
    <div>
      <Header />
      <Landing />
    <Banner />
    <Video />
    <Test />
    <Footer />
    </div>
  )
}

export default Home