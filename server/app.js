const express = require("express");
require("dotenv").config();
require("./models/db");
const userRouter = require("./routes/user");
const activityRouter = require("./routes/activity");
const communityRouter = require("./routes/community");
const companyRouter = require("./routes/company");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

app.use((req, res, next) => {
  const date = new Date();
  console.log(`${date.toISOString()}: ${req.method} ${req.url} responded with ${res.statusCode}`);
  next();
});
app.use(userRouter);
app.use(activityRouter);
app.use(communityRouter);
app.use(companyRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to the API" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
