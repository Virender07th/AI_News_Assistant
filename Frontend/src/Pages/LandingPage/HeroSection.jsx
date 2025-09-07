import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import CardWithIcon from "./CardWithIcon";
import CardwithImage from "./CardWithImage";
import Button from "../../Components/Resusable/Button";
import {
  featuresData,
  mainFeatures,
  workFlowData,
} from "../../Data/featuresData";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const HeroSection = () => {
  return (
    <div className="w-full px-4 sm:px-6 py-16 space-y-20 bg-white">
      {/* SECTION 1: Main AI Capabilities */}
      <motion.section
        className="max-w-6xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        variants={fadeInUp}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent mb-4 tracking-tight">
          Core Features of Our AI-Powered News Platform
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Explore the groundbreaking tools transforming how news is generated,
          presented, and consumed.
        </p>

        <motion.div
          className="flex flex-wrap justify-center gap-10"
          variants={staggerContainer}
        >
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="w-[240px] flex justify-center transition-transform duration-300 hover:scale-105 hover:rotate-[-1deg] rounded-2xl hover:shadow-xl "
              variants={fadeInUp}
              whileHover={{ scale: 1.06, rotate: -1 }}
            >
              <CardwithImage {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* SECTION 2: AI-Enhanced News Intelligence */}
      <motion.section
        className="max-w-6xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        variants={fadeInUp}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text  text-transparent  mb-4 tracking-tight">
          Advanced AI Tools to Elevate Your News Understanding
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Summarize articles, detect bias, fact-check content, translate across
          languages, and more — all with one powerful AI assistant.
        </p>

        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={30}
          loop={true}
          allowTouchMove={false}
          speed={5000} // bigger = slower movement across entire loop
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          grabCursor={false}
          className="w-full h-[300px] px-2"
        >
          {/* Duplicate 3x to ensure loop has enough content to be seamless */}
          {featuresData.map(
            (feature, index) => (
              <SwiperSlide
                key={index}
                className="!w-[260px] flex justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  className="w-full h-full"
                >
                  <CardWithIcon {...feature} />
                </motion.div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </motion.section>

      {/* workFlow  */}

<motion.section
  className="max-w-6xl mx-auto text-center"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.4 }}
  variants={fadeInUp}
>
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent mb-10 -mt-5 tracking-tight">
    How It Works
  </h2>

  <motion.div
    className="flex flex-col items-center relative space-y-10"
    variants={staggerContainer}
  >
    {workFlowData.map((feature, index) => {
      const Icon = feature.icon;

      return (
        <motion.div
          key={index}
          className="relative flex flex-row items-start gap-6 text-left z-10"
          variants={fadeInUp}
        >
          {/* Icon in circle */}
          <div className="relative flex flex-col items-center">
            <div className="bg-white border-4 border-blue-100 p-3 rounded-full shadow-md z-10 w-14 h-14 flex items-center justify-center">
              <Icon size={24} className="text-blue-600" />
            </div>

            {/* Connecting vertical line */}
            {index !== workFlowData.length - 1 && (
              <div className="absolute top-14 h-23 w-1 bg-gray-300 z-0" />
            )}
          </div>

          {/* Title & Description */}
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {feature.description}
            </p>
          </div>
        </motion.div>
      );
    })}
  </motion.div>
</motion.section>



      {/* SECTION 3: CTA */}
      <motion.section
        className="max-w-6xl mx-auto px-4 text-center flex flex-col justify-center items-center space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        variants={fadeInUp}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-sky-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent tracking-tight">
          Ready to Experience the Future of News?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl">
          Sign up now and explore how AI can revolutionize how you read,
          understand, and interact with the news.
        </p>
        <Link to="/register">
          <Button
            data={true}
            condition={true}
            color={true}
            content="Get Started"
            style="max-w-[220px]"
          />
        </Link>
      </motion.section>
    </div>
  );
};

export default HeroSection;
