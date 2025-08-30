import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ContactUs from "../Components/Common/ContactUs";
import Footer from "../Components/Common/Footer";
import Navbar from "../Components/Common/Navbar";
import HeroSection from "./LandingPage/HeroSection";
import HeadingPage from "./LandingPage/HeadingPage";
import ImagePart from "./LandingPage/ImagePart";

const Home = ({ isLoggedIn }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full min-h-screen"
    >
      <div className="backdrop-blur-md">
        <Navbar isLoggedIn={isLoggedIn} />
        <HeadingPage/>
        <ImagePart/>
        <HeroSection/>
        <ContactUs />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
