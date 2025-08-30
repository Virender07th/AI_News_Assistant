import crypto from "crypto";

const generateNewsId = (title, publishedAt , url) => {
  return crypto
    .createHash("sha256")
    .update(`${title.trim().toLowerCase()}${publishedAt}${url}`)
    .digest("hex");
};

export default generateNewsId;