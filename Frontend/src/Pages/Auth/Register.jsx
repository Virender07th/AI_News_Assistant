import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
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
      localStorage.setItem("token", token);
      toast.success("Login successful");
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div
  className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 ${
    loginTypeForm ? "pt-[20px]" : "pt-17"
  }`}
>
      <div className="max-w-sm mx-auto">
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          {/* Form Content */}
          {loginTypeForm ? (
            <SignupForm setLoginTypeForm={setLoginTypeForm} />
          ) : (
            <LoginForm setLoginTypeForm={setLoginTypeForm} />
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <a
              href="http://localhost:8000/api/v1/auth/google"
              className="w-full flex items-center justify-center gap-3 h-11 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 bg-white text-gray-700 font-medium text-sm shadow-sm"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </a>

            <a
              href="http://localhost:8000/api/v1/auth/facebook"
              className="w-full flex items-center justify-center gap-3 h-11 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl transition-all duration-300 text-white font-medium text-sm shadow-md hover:shadow-lg"
            >
              <FaFacebook className="w-5 h-5" />
              Continue with Facebook
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-3">
          {/* Toggle Form Type */}
          <div className="text-sm text-gray-600">
            {loginTypeForm ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setLoginTypeForm(!loginTypeForm)}
              className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 inline-flex items-center gap-1"
            >
              {loginTypeForm ? "Sign In" : "Sign Up"}
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Forgot Password - Only show for login */}
          {!loginTypeForm && (
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors duration-200"
            >
              Forgot your password?
            </button>
          )}
        </div>

        {/* Terms and Privacy */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <button className="text-blue-600 hover:text-blue-700 underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;