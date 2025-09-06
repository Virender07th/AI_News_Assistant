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


/**
 * Formats an array of articles into a single string for a WhatsApp message.
 *
 * @param {Array<Object>} articles - An array of article objects. Each object
 * should have `heading`, `url`, and an optional `description`.
 * @returns {string} A formatted string ready for WhatsApp.
 */
export const whatsappMessageBody = (articles) => {
  // 1. Handle invalid or empty input gracefully.
  if (!Array.isArray(articles) || articles.length === 0) {
    return "📰 No new articles today. Check back later!";
  }

  const header = "📰 Your AI-Curated News Update 📰";

  // 2. Use `map` and `join` for cleaner, more functional code.
  const articlesContent = articles
    .map((article, index) => {
      // 3. Use default values (??) and WhatsApp formatting (*bold*).
      const heading = article.heading ?? 'No Title Available';
      const description = article.description ?? '';
      const url = article.url;

      // 4. Create a smarter preview that only adds "..." if needed.
      const preview = description.length > 120
        ? `${description.slice(0, 120)}...`
        : description;

      // 5. Use template literals for clear, readable string construction.
      return `${index + 1}. *${heading}*\n${preview}\n🔗 ${url}`;
    })
    .join('\n\n'); // Use a double newline to separate articles.

  const footer = "✨ Powered by AI-curated insights. Stay informed via WhatsApp!";

  return `${header}\n\n${articlesContent}\n\n${footer}`;
};