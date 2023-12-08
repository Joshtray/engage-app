const express = require("express");
require("dotenv").config();
require("./models/db");
const userRouter = require("./routes/user");
const activityRouter = require("./routes/activity");
const communityRouter = require("./routes/community");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(activityRouter);
app.use(communityRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to the API" });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
