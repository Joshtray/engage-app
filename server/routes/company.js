const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares/auth");
const Company = require("../models/company");

router.get("/companies/:id", isAuth, async (req, res) => {
  const companyId = req.params.id;
  const user = req.user;

  const company = await Company.findById(companyId);
  if (!company)
    return res
      .status(404)
      .json({ success: false, message: "Company not found" });

  if (!company.employees.includes(user._id))
    return res.status(401).json({ success: false, message: "Unauthorized" });
  res.status(200).send({ success: true, company });
});

module.exports = router;
