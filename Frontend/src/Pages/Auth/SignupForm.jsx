
// SignupForm.jsx
import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../Slice/authSlice";
import { sendotp } from "../../Service/Operations/AuthAPI";
import toast from "react-hot-toast";
import { User, Mail, Lock, Shield } from "lucide-react";

const SignupForm = ({ setLoginTypeForm }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userName, email, password, confirmPassword } = formData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      dispatch(setSignupData(formData));
      await dispatch(sendotp(formData.email, navigate));
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const isFormValid = userName && email && password && confirmPassword && password === confirmPassword;

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Join us to start your learning journey</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-3">
        <InputField
          label="Full Name"
          name="userName"
          type="text"
          placeholder="Enter your full name"
          value={formData.userName}
          onChange={onChangeHandler}
          icon={User}
          iconPosition="left"
          required
        />

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
          placeholder="Create a password"
          value={formData.password}
          onChange={onChangeHandler}
          icon={Lock}
          iconPosition="left"
          helperText="Password must be at least 6 characters long"
          required
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={onChangeHandler}
          icon={Shield}
          iconPosition="left"
          // error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
          // success={confirmPassword && password === confirmPassword ? "Passwords match" : ""}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          data={isFormValid}
          condition={isFormValid}
          content="Create Account"
          loading={loading}
          fullWidth
        />
      </form>
    </div>
  );
};

export default SignupForm;