import React from "react";
import { motion } from "framer-motion";
import NewsPaperImage from "../../assets/NewsPaperImage.png";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";

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
      staggerChildren: 0.15,
    },
  },
};

const ImagePart = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full px-4 sm:px-6 py-8 flex flex-col items-center gap-16 max-w-[1100px] mx-auto">
      <div className="w-full relative rounded-xl overflow-hidden shadow-xl">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <div className="relative w-full h-full ">
            {/* Background Image */}
            <img
              src={NewsPaperImage}
              alt="NewsPaperImage"
              className="absolute w-full h-full object-center object-cover "
            />

            {/* Overlay Content with Animation */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={staggerContainer}
            >
              <div className="flex flex-col items-center text-center space-y-6 max-w-2xl">
                <motion.h1
                  className="text-white font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-md"
                  variants={fadeInUp}
                >
                  Revolutionizing News Consumption with AI
                </motion.h1>

                <motion.p
                  className="text-white text-sm sm:text-lg drop-shadow-sm"
                  variants={fadeInUp}
                >
                  Experience the future of news with our AI-powered platform. Get
                  unbiased, fact-checked, and insightful content delivered to you.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
                  variants={fadeInUp}
                >
                  <Button
                    content="Login"
                    condition={true}
                    data={true}
                    color={true}
                    style="max-w-[220px] px-10"
                    click={() => navigate("/register")}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePart;
