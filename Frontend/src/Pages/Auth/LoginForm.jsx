// LoginForm.jsx
import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";
import { login } from "../../Service/Operations/AuthAPI";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Mail, Lock } from "lucide-react";

const LoginForm = ({ setLoginTypeForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(login(formData.email, formData.password, navigate));
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={onChangeHandler}
          icon={Mail}
          iconPosition="left"
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={onChangeHandler}
          icon={Lock}
          iconPosition="left"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          data={formData.email && formData.password}
          condition={formData.email && formData.password}
          content="Sign In"
          loading={loading}
          fullWidth
        />
      </form>
    </div>
  );
};

export default LoginForm;
