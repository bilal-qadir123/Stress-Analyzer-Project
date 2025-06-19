import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaPlay, FaQuoteLeft } from 'react-icons/fa';
import VideoPlayer from "./assets/project11.mp4";
import Thumbnail from "./assets/testimonial-bg.jpg";

const testimonials = [
  { 
    text: "The personalized strategies helped me manage work stress effectively. Highly recommend!",
    author: "Sarah, Marketing Manager"
  },
  {
    text: "Finally found a tool that understands my anxiety patterns. Life-changing experience.",
    author: "James, Software Developer"
  },
  {
    text: "The mindfulness exercises integrated with AI insights are incredibly effective.",
    author: "Emma, University Student"
  }
];

export default function Video() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={Thumbnail} 
              alt="Video thumbnail" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20" />
            <a
              href={VideoPlayer}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <motion.div
                className={`absolute w-24 h-24 rounded-full ${
                  isHovered ? 'bg-green-400' : 'bg-white'
                } transition-colors`}
                animate={{ scale: isHovered ? 1.1 : 1 }}
              />
              <FaPlay className="text-4xl text-green-600 ml-2 z-10" />
            </a>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-3 text-green-600">
              <FaQuoteLeft className="text-3xl" />
              <h2 className="text-2xl font-bold text-gray-800">Success Stories</h2>
            </div>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop
              autoplay={{ delay: 5000 }}
              className="swiper-custom"
            >
              <style>
        {`
            .swiper-button-next::after,
            .swiper-button-prev::after {
              font-size: 35px;
            }
        `}
    </style>
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-8 rounded-2xl border border-gray-300"
                  >
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                      {testimonial.text}
                    </p>
                    <p className="font-medium text-gray-800">{testimonial.author}</p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </div>
    </section>
  );
}