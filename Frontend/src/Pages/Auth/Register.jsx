import React, { useState } from "react";
import LoginImage from "../../assets/LoginImage.png";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Button from "../../Components/Resusable/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loginTypeForm, setLoginTypeForm] = useState(false);
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4  sm:px-4">
      <div className="flex flex-col items-center justify-center w-full py-5 max-w-[1080px] rounded-2xl">
        {/* Header */}
        <div className="text-center mb-6 px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Welcome to AI Study Platform
          </h1>
          <p className="text-sm text-gray-500">
            Empowering your learning journey with AI.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-center md:flex-row w-full gap-6 items-center">
          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-5 px-2">
            {loginTypeForm ? (
              <SignupForm setLoginTypeForm={setLoginTypeForm} />
            ) : (
              <LoginForm setLoginTypeForm={setLoginTypeForm} />
            )}

            {/* Divider */}
            <div className="flex items-center gap-2 w-full max-w-[435px]">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col  gap-4 justify-center items-center w-full max-w-[435px]">
              <Button
                icon={FcGoogle}
                color={false}
                content="Continue with Google"
                style=" max-w-[250px] w-[210px] sm:w-full"
                data={true}
                condition={true}
              />
              <Button
                icon={FaFacebook}
                color={true}
                content="Continue with Facebook"
                data={true}
                condition={true}
                style="max-w-[250px] sm:w-full"
              />
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm text-gray-600 mt-4 w-full max-w-[435px] space-y-1">
              <p>
                Forgot your password?{" "}
                <button
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => navigate("/forget-password") }
                >
                  Reset here
                </button>
              </p>
              <p>
                {loginTypeForm
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => setLoginTypeForm(!loginTypeForm)}
                >
                  {loginTypeForm ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:flex md:w-1/2 justify-center items-center">
            <img
              src={LoginImage}
              alt="Register Visual"
              className="w-full max-w-[430px] h-[550px] object-cover rounded-2xl shadow-lg hover:shadow-xl shadow-[#f9e6c9] transition-all duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
