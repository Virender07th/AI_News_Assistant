
// CheckEmailPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Resusable/Button";
import { Mail, CheckCircle, ArrowLeft, ExternalLink } from "lucide-react";

const CheckEmailPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <div className="relative">
              <Mail className="w-8 h-8 text-green-600" />
              <CheckCircle className="w-6 h-6 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Didn't receive the email?</strong>
              <br />
              Check your spam folder or try resending the link.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          
          <Button
            variant="outline"
            size="lg"
            content="Back to Sign In"
            icon={ArrowLeft}
            iconPosition="left"
            click={() => navigate("/register")}
            fullWidth
          />
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Resend reset link
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;