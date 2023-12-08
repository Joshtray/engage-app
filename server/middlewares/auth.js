const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  const token = req?.headers?.authorization;
  if (!token) return res.json({ success: false, message: "Unauthorized" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId);
    if (!user) return res.json({ success: false, message: "Unauthorized" });
    req.user = user;
    next();
  }
  catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.json({ success: false, message: "Unauthorized" });
    }
    if (err.name === "TokenExpiredError") {
      return res.json({ success: false, message: "Session expired" });
    }

    return res.json({ success: false, message: "Something went wrong" });
  }
  
};
