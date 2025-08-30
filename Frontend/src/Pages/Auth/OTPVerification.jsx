import React, { useState } from "react";
import OtpInput from "react-otp-input";
import Button from "../../Components/Resusable/Button";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("Entered OTP:", otp);
    // Implement OTP verification logic here
  };

  const handleResend = () => {
    console.log("Resend OTP");
    // Implement resend logic
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <div  className="w-[960px] max-w-[960px] h-[650px] bg-white shadow-lg rounded-xl py-5 px-6 flex flex-col ">
       <div className="max-w-[500px] w-full mx-auto">
         <h1 className="text-2xl font-bold text-center text-[#121417] mb-2">
          Enter Verification Code
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Please enter the 6-digit code we sent to your email address.
        </p>

        <div className="max-w-[500px] p-4 lg:p-8 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
          >
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
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-b-3 border-[#DBE0E5] bg-[#FFFFFF] rounded-md text-richblack-5 aspect-square text-center text-lg text-gray-700 focus:outline-2 focus:outline-gray-100"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />

            <Button
              data={otp.length !== 6}
              condition={otp.length !== 6}
              content={"Verfiy Code"}
            />
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:underline focus:outline-none"
            >
              Resend
            </button>
          </div>
        </div>
       </div>

      </div>
    </div>
  );
};

export default OTPVerification;
