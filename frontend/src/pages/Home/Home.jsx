import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SlideOne from './SlideOne';
import SlideTwo from './SlideTwo';
import SlideThree from './SlideThree';
import AnnouncementBar from '../AnnouncementBar/AnnouncementBar';
import RecommendedBooks from '../RecommendedBooks/RecommendedBooks';
import WhyGratun from './WhyGratun';
import BlogShowcase from '../BlogShowcase/BlogShowcase';
import Seo from '../Seo/Seo';
import ReadingQuote from './ReadingQuote';

const Home = () => {
  return (
    <>
      <Seo url="https://www.gratunhub.am/" />

      <Swiper
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        autoHeight={true}
        modules={[Autoplay, Pagination, Navigation]}
      >
        <SwiperSlide><SlideOne /></SwiperSlide>
        <SwiperSlide><SlideTwo /></SwiperSlide>
        <SwiperSlide><SlideThree /></SwiperSlide>
      </Swiper>

      <AnnouncementBar />

      <ReadingQuote />
      <RecommendedBooks />
      <BlogShowcase />
      <WhyGratun />
    </>
  );
};

export default Home;