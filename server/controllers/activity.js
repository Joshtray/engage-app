const jwt = require("jsonwebtoken");

const Activity = require("../models/activity");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sizeOf = require("image-size");

exports.uploadActivityImage = async (req, res) => {
  const { user, activity } = req;
  const dimensions = sizeOf(req.file.path);
  if (!user)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${activity._id}_activity`,
      width: dimensions.width,
      height: dimensions.height,
      crop: "fill",
      overwrite: true,
    });

    const updatedActivity = await Activity.findByIdAndUpdate(
      activity._id,
      { image: result.url },
      { new: true }
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Activity image uploaded successfully",
        activity: updatedActivity,
      });
  } catch (err) {
    console.log("Error while uploading activity image: ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
