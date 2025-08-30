import React, { useState } from 'react'
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";

const ForgetPassword = () => {
    const [email , setEmail] =useState("");
     const submitHandler = (e) => {
    e.preventDefault();
    alert("Email submitted: " + email);
  };
    const handleResend = () => {
    console.log("login route");
    // Implement resend logic
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <div  className="w-[960px] max-w-[960px] h-[650px] bg-white shadow-lg rounded-xl py-5 px-6 flex flex-col ">
       <div className="max-w-[500px] w-full mx-auto">
         <h1 className="text-2xl font-bold text-center text-[#121417] mb-2">
         Forgot your password?
        </h1>
        <p className="text-sm text-center text-gray-600 mb-2">
          Enter the email address associated with your account, and we'll send you a link to reset your password.
        </p>

        <div className="max-w-[500px] p-4 lg:p-8 mx-auto">
          <form
            onSubmit={submitHandler}
          >
            
            <InputField
            type='email'
            name="email"
            label={"Email"}
            placeholder={"Email"}
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            required
            style={`h-[40px] w-[435px]`}
            />
            
            <Button
            data={email}
            condition={email}
            content={"Send reset link"}
            click={handleResend}
            
            />
            
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:underline focus:outline-none"
            >
              Log in
            </button>
          </div>
        </div>
       </div>

      </div>
    </div>
  );
}

export default ForgetPassword
{/* <button
              type="submit"
              disabled={!email}
              className={`w-full bg-[#1A7DE5] h-[48px] px-[20px] rounded-[24px] mt-6 font-medium text-[#FFFFFF] transition duration-200 ${
                email  ? "hover:bg-[#166FCC]" : "opacity-50 cursor-not-allowed"}`}
            >
              Send reset link
            </button>/ */}