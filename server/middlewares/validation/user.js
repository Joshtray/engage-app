const { check, validationResult } = require("express-validator");

exports.validateUserSignUp = [
  check("fullname")
    .trim()
    .not()
    .isEmpty()
    .isString()
    .withMessage("Must be a valid name.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Fullname must be between 3 to 20 characters long."),
  check("email").normalizeEmail().isEmail().withMessage("Email must be valid."),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters long."),
  check("confirmPassword").trim().not().isEmpty().custom((val, {req}) => {
    if (val !== req.body.password) {
      throw new Error("Passwords must match.");
    }
    return true;
  }),
];

exports.userValidationResult = (req, res, next) => {
    const result = validationResult(req).array();
    if (!result.length) return next();

    const error = result[0].msg;
    res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
    check("email").trim().isEmail().withMessage("Email / Password is required!"),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Emai / Password is required!")
  ];