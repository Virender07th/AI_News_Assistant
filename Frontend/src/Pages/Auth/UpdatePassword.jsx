import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword:"",
    newPassword: "",
    confirmPassword: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Reset password with:", formData);
    // ✅ Add password reset logic here
  };
  return (
    <div className="flex items-center justify-center  px-4">
      <div className="w-[960px] max-w-[960px] h-[650px] bg-white shadow-lg  rounded-xl py-5 px-6 flex flex-col ">
        <div className="max-w-[450px] flex flex-col justify-center items-center   w-full mx-auto space-y-6 ">
          <h1 className="font-lexend font-bold text-3xl text-[#121417]">
            Change your password{" "}
          </h1>
          {/* <p>Change your passwors</p> */}
          <form
            onSubmit={submitHandler}
            className="space-y-5 flex flex-col justify-center items-center"
          >
            <InputField
              placeholder={"Current Password"}
              name="currentPassword"
              type="password"
              onChange={onChangeHandler}
              value={formData.currentPassword}
              style={`h-[40px] w-[435px]`}
              required
            />
            <InputField
              placeholder={"New Password"}
              name="newPassword"
              type="password"
              onChange={onChangeHandler}
              value={formData.newPassword}
              style={`h-[40px] w-[435px]`}
              required
            />
            <InputField
              placeholder={"New Password"}
              name="newPassword"
              type="password"
              onChange={onChangeHandler}
              value={formData.newPassword}
              style={`h-[40px] w-[435px]`}
              required
            />
            <InputField
              placeholder={"Confirm Password"}
              name="confirmPassword"
              type="password"
              onChange={onChangeHandler}
              value={formData.confirmPassword}
              style={`h-[40px] w-[435px]`}
              required
            />
            <Button
              date={formData.newPassword &&
                formData.confirmPassword &&
                formData.newPassword === formData.confirmPassword}
              condition={
                formData.newPassword &&
                formData.confirmPassword &&
                formData.newPassword === formData.confirmPassword
              }
              content={"Reset password"}
              
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
