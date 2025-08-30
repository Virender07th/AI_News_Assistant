import React, { useState } from "react";
import InputField from "../Resusable/InputField";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import Button from "../Resusable/Button";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // TODO: Add toast or API integration here
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-100 flex justify-center items-start">
      <div className="w-full max-w-6xl flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-3">
          Contact Us
        </h1>

        <p className="text-gray-600 text-base sm:text-lg mb-6 text-center max-w-2xl">
          We'd love to hear from you. Whether you have a question, feedback, or
          just want to connect — reach out!
        </p>

        {/* Flex Grid */}
        <div className="w-full flex flex-col lg:flex-row gap-15">
          {/* Form */}
          <form
            onSubmit={SubmitHandler}
            className="flex flex-col gap-3 w-full max-w-[70vw] sm:max-w-[450px] lg:max-w-[500px] mx-auto px-4 sm:px-6 lg:px-8 pb-6    "
          >
            <InputField
              label="Your Name"
              name="userName"
              placeholder="Enter your name"
              value={formData.userName}
              onChange={handleChange}
              fieldStyle="w-full h-[40px]  px-4 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <InputField
              label="Your Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              fieldStyle="w-full h-[40px] px-4 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <InputField
              label="Subject"
              name="subject"
              placeholder="Enter your subject"
              value={formData.subject}
              onChange={handleChange}
              fieldStyle="w-full h-[40px] px-4 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows="6"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-center">
              <Button
                content="Send Message"
                condition={true}
                data={true}
                color={true}
                style="max-w-[220px] px-8"
              />
            </div>
          </form>

          {/* Contact Info & Social */}
          <div className="flex flex-col justify-start text-center lg:text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Contact Information
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              📧 Email:{" "}
              <a
                href="mailto:support@newsai.com"
                className="text-blue-600 hover:underline"
              >
                support@newsai.com
              </a>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              📍 Address: 123 Innovation Drive, Tech City, CA 90210
            </p>

            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Connect with us:
            </h3>
            <div className="flex space-x-6 justify-center lg:justify-start text-gray-600 mt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-black transition"
              >
                <FaGithub size={22} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-700 transition"
              >
                <FaLinkedin size={22} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-blue-500 transition"
              >
                <FaTwitter size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500  text-center">
          We'll get back to you within 24 hours. Thanks for reaching out!
        </p>
      </div>
    </div>
  );
};

export default ContactUs;


 