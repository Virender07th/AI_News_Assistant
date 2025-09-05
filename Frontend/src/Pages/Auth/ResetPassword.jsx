
// ResetPassword.jsx
import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../Service/Operations/AuthAPI";
import { Lock, Shield, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();

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
      await dispatch(resetPassword(formData.password, formData.confirmPassword, token, navigate));
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.password && formData.confirmPassword && 
                     formData.password === formData.confirmPassword &&
                     formData.password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Create a new password for your account</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <InputField
            label="New Password"
            placeholder="Enter new password"
            name="password"
            type="password"
            onChange={onChangeHandler}
            value={formData.password}
            icon={Lock}
            iconPosition="left"
            helperText="Password must be at least 6 characters long"
            required
          />

          <InputField
            label="Confirm New Password"
            placeholder="Confirm new password"
            name="confirmPassword"
            type="password"
            onChange={onChangeHandler}
            value={formData.confirmPassword}
            icon={Shield}
            iconPosition="left"
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
            success={formData.confirmPassword && formData.password === formData.confirmPassword ? "Passwords match" : ""}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            data={isFormValid}
            condition={isFormValid}
            content="Reset Password"
            loading={loading}
            fullWidth
          />
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;