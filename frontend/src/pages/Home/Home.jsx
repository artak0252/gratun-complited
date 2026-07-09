
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './Home.module.css';
import SlideOne from './SlideOne';
import SlideTwo from './SlideTwo';
import SlideThree from './SlideThree';
import RecommendedBooks from '../RecommendedBooks/RecommendedBooks';
import WhyGratun from './WhyGratun';
import GenreShowcase from './GenreShowcase';

const Home = () => {
  return (
    <>
      <RecommendedBooks />
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

      <WhyGratun />
      <GenreShowcase />
    </>
  );
};

export default Home;