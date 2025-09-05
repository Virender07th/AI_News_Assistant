
// OTPVerification.jsx
import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { sendotp, signUp } from "../../Service/Operations/AuthAPI";
import { Shield, Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signupData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!signupData) {
      navigate("/register");
    }
  }, [signupData, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const { userName, email, password, confirmPassword } = signupData;
      await dispatch(signUp(userName, email, password, confirmPassword, otp, navigate));
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      await dispatch(sendotp(signupData.email));
      setResendTimer(60);
      setCanResend(false);
      setOtp("");
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-6 ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600 mb-2">
            We've sent a 6-digit verification code to
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
            <Mail className="w-4 h-4" />
            {signupData?.email}
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
         <div className="space-y-4 text-center">
            <label className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  type="tel"
                  placeholder="-"
                  style={{
                    boxShadow:
                      "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-b-3 border-[#DBE0E5] bg-white rounded-md text-gray-700 aspect-square text-center text-lg focus:outline-2 focus:outline-gray-100"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            data={otp.length === 6}
            condition={otp.length === 6}
            content="Verify Code"
            loading={loading}
            fullWidth
          />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Didn't receive the code?
          </p>
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Resend code in {resendTimer} seconds
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate("/register")}
            className="flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;