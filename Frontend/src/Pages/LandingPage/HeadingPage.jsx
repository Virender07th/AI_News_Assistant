import React from "react";
import { motion } from "framer-motion";
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

const HeadingPage = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className=" flex flex-col justify-center items-center text-center px-4 my-28 "
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      whileInView="visible"
      viewport={{ once: false, amount: 0.4 }}
    >
      <motion.h1
        className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent mb-5 tracking-tight"
        variants={fadeInUp}
      >
        Stay Informed with AI-Powered News
      </motion.h1>

      <motion.p
        className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
        variants={fadeInUp}
      >
        

          Experience the future of news with NewsAI. Our platform uses advanced AI to deliver insightful, unbiased, and fact-checked news tailored to your interests.
      </motion.p>

      <motion.div
        className="flex flex-row items-center justify-center gap-4 w-full max-w-md"
        variants={fadeInUp}
      >
        <Button
          content="Get Started"
          condition={true}
          data={true}
          color={true}
          style="max-w-[220px] px-5"
          click={() => navigate("/register")}
        />
        <Button
          content="Login"
          condition={true}
          data={true}
          color={false}
          style="max-w-[220px] px-8"
          click={() => navigate("/register")}
        />
      </motion.div>
    </motion.div>
  );
};

export default HeadingPage;
