export const forgotPasswordTemplate = (userName, resetUrl) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4CAF50;">Password Reset Request</h2>
    <p>Hi ${userName},</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; background:#4CAF50; color:#fff; text-decoration:none; border-radius:5px;">
      Reset My Password
    </a>
    <p>If the button doesn't work, copy and paste the following link into your browser:</p>
    <p style="word-break: break-all;">${resetUrl}</p>
    <p>This link will expire in <strong>15 minutes</strong>.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <hr />
    <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
`;


export const resetPasswordSuccessTemplate = (userName) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4CAF50;">Password Reset Successful</h2>
    <p>Hi ${userName},</p>
    <p>Your password has been successfully reset. You can now log in with your new password.</p>
    <p>If you did not perform this action, please contact our support team immediately.</p>
    <hr />
    <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
`;

export const changePasswordTemplate = (userName) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4CAF50;">Password Changed</h2>
    <p>Hi ${userName},</p>
    <p>Your account password has been successfully changed.</p>
    <p>If you didn’t make this change, please reset your password immediately and contact support.</p>
    <hr />
    <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
`;

export const otpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333;">
    <h2 style="color: #4CAF50;">Your OTP Code</h2>
    <p style="font-size: 16px;">Use the OTP code below to proceed:</p>
    <div style="font-size: 32px; font-weight: bold; color: #4CAF50; margin: 20px 0;">
      ${otp}
    </div>
    <p style="font-size: 14px; color: #555;">This code is valid for <strong>5 minutes</strong>.</p>
    <p style="font-size: 12px; color: #999;">Do not share this code with anyone.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
`;


