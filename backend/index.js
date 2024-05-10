const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/user");
const { panel } = require("./utils/panel");
const PORT = 3002;

app.use(bodyParser.json());
app.use(cors());
app.use("/user", usersRouter)
app.use("/panel", panel);

app.listen(PORT, () => {
  console.log(`Server running on https://validpanel.com:${PORT}/`);
});
