import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setLoginTypeForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "demo-token");
    navigate("/dashboard");
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-4 w-full max-w-[435px] px-2 justify-center items-center"
    >
      <InputField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={onChangeHandler}
        style=""
        required
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={onChangeHandler}
        style="h-[40px] w-full"
        required
      />
      <Button
        type="submit"
        data={formData.email && formData.password}
        condition={formData.email && formData.password}
        content="Login"
        style="max-w-[250px] w-[210px] sm:w-full"
      />
    </form>
  );
};

export default LoginForm;
