const { checkRequired } = require("../helper/utils");
const User = require("../model/user");

exports.login = async (req, res) => {
  try {
    const requiredArr = ["email", "password"];
    const missing = await checkRequired(requiredArr, req.body);
    if (missing?.length > 0) {
      return res.status(400).send({
        success: false,
        msg: "Required fields missing.",
        missing: missing,
      });
    }
    const { email, password } = req.body;
    const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(400).send({
        success: false,
        msg: "Email or password is invalid.",
      });
    }
    const isValidPassword = await isExist.comparePassword(password);
    console.log("isValidPassword", isValidPassword);

    if (!isValidPassword) {
      return res.status(400).send({
        success: false,
        msg: "Email or password is invalid.",
      });
    }
    const JWTToken = await isExist.generateToken();
    return res.status(200).send({
      success: true,
      msg: "Login successful.",
      token: JWTToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Something went wrong" });
  }
};

exports.signup = async (req, res) => {
  try {
    const requiredArr = ["email", "password"];
    const missing = await checkRequired(requiredArr, req.body);
    if (missing?.length > 0) {
      return res.status(400).send({
        success: false,
        msg: "Required fields missing.",
        missing: missing,
      });
    }
    const { email, password } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).send({
        success: false,
        msg: "Email already exist.",
      });
    }
    await User.create({ email: email, password: password });
    return res.status(201).send({
      success: true,
      msg: "User registered successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Something went wrong" });
  }
};
