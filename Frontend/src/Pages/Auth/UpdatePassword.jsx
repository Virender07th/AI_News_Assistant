
// UpdatePassword.jsx
import React, { useState } from "react";
import InputField from "../../Components/Resusable/InputField";
import Button from "../../Components/Resusable/Button";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../Service/Operations/ProfileAPI";
import { Lock, Shield, Key } from "lucide-react";
import toast from "react-hot-toast";

const UpdatePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { password, newPassword, confirmPassword } = formData;
  const { token } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await dispatch(changePassword(token, formData));
      toast.success("Password updated successfully");
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = password && newPassword && confirmPassword && 
                     newPassword === confirmPassword && newPassword.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
          <p className="text-gray-600">Update your account password</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <InputField
            label="Current Password"
            placeholder="Enter current password"
            name="password"
            type="password"
            onChange={onChangeHandler}
            value={formData.password}
            icon={Lock}
            iconPosition="left"
            required
          />

          <InputField
            label="New Password"
            placeholder="Enter new password"
            name="newPassword"
            type="password"
            onChange={onChangeHandler}
            value={formData.newPassword}
            icon={Shield}
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
            error={confirmPassword && newPassword !== confirmPassword ? "Passwords do not match" : ""}
            success={confirmPassword && newPassword === confirmPassword ? "Passwords match" : ""}
            required
          />

          <div className="flex gap-3">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                content="Cancel"
                click={onClose}
                fullWidth
              />
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              data={isFormValid}
              condition={isFormValid}
              content="Update Password"
              loading={loading}
              fullWidth
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;