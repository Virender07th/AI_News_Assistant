import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../Slice/authSlice";
import { sendotp } from "../../Service/Operations/AuthAPI";
import toast from "react-hot-toast";
const SignupForm = ({ setLoginTypeForm }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userName, email, password, confirmPassword } = formData

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const submitHandler = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword){
      toast.error("Passwords Do Not Match");
      return;
    }
    dispatch(setSignupData(formData));
     console.log("formData",formData);
    dispatch(sendotp(formData.email , navigate));

    setFormData({
      userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    })
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-4 w-full justify-center items-center max-w-[435px]"
    >
      <InputField
        label="Name"
        name="userName"
        type="text"
        placeholder="Enter your name"
        value={formData.userName}
        onChange={onChangeHandler}
        style="h-[40px] w-[435px]"
        required
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={onChangeHandler}
        style="h-[40px] w-[435px]"
        required
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={onChangeHandler}
        style="h-[40px] w-[435px]"
        required
      />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={onChangeHandler}
        style="h-[40px] w-[435px]"
        required
      />
      <Button
        type="submit"
        data={true}
        condition={true}
        content="Sign up"
        style="max-w-[250px] w-[210px] sm:w-full"
      />
     
    </form>
  );
};

export default SignupForm;
