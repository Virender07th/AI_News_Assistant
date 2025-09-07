import crypto from "crypto";

const generateNewsId = (title , url) => {
  return crypto
    .createHash("sha256")
    .update(`${title.trim().toLowerCase()}${url}`)
    .digest("hex");
};

export default generateNewsId;