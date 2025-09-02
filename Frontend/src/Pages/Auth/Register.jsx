import React, { useState ,  useEffect } from "react";
import LoginImage from "../../assets/LoginImage.png";
import { ArrowRight, Users } from "lucide-react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Button from "../../Components/Resusable/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Register = () => {
   const [loginTypeForm, setLoginTypeForm] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token); // save token
    toast.success("Login successful");
    navigate("/dashboard"); // now PrivateRoute will allow access
  }
}, [navigate]);

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
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <a
                href="http://localhost:8000/api/v1/auth/google"
                className="flex-1 flex items-center justify-center gap-3 h-12 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-300 bg-white text-gray-700 font-medium text-sm"
              >
                <FcGoogle className="w-5 h-5" />
                Google
              </a>

              <a
                href="http://localhost:8000/api/v1/auth/facebook"
                className="flex-1 flex items-center justify-center gap-3 h-12 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl transition-colors duration-300 text-white font-medium text-sm shadow-sm hover:shadow-md"
              >
                <FaFacebook className="w-5 h-5" />
                Facebook
              </a>
            </div>

            {/* Footer Links */}
           <div className="text-center w-full max-w-md pt-4">
              <div className="text-sm text-gray-600 mb-2">
                {loginTypeForm
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  onClick={() => setLoginTypeForm(!loginTypeForm)}
                  className="ml-1 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  {loginTypeForm ? "Sign In" : "Sign Up"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Forgot your password?
              </button>
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
