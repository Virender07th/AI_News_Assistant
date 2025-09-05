
// ForgetPassword.jsx
import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forgetPassword } from "../../Service/Operations/AuthAPI";
import { Mail, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await dispatch(forgetPassword(email, navigate));
      toast.success("Password reset link sent to your email");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            iconPosition="left"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            data={email}
            condition={email}
            content="Send Reset Link"
            loading={loading}
            fullWidth
          />
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBackToLogin}
            className="flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;