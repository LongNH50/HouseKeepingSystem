import jwt from "jsonwebtoken";

export default function checkTokenForUsers(req, res, next) {
  try {
    const header = req.headers["authorization"];
    console.log('checkTokenForUsers: '+header);
    const token = header.split(" ")[1];
    if (token) {
      const decoded_token = jwt.verify(token, process.env.SECRET_KEY_USER);
      if (decoded_token) {
        req.token = decoded_token;
        next();
      } else {
        next(new Error(`Invalid User Token`));
      }
    } else {
      next(new Error(`Token not found`));
    }
  } catch (error) {
    next(error);
  }
}

