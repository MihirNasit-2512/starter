const User = require("../model/user");
const verifyToken = async (req, res, next) => {
  try {
    const headerData = req?.headers?.["authorization"]?.split("Bearer ");
    const token = headerData?.[0] || headerData?.[1]
    if (!token) {
      return res.status(401).json({ success: false, msg: "Unauthorized!" });
    }
    const user = await User.findByToken(token);
    if (!user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, msg: "Token expired!" });
  }
};

module.exports = verifyToken;
