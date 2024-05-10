const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/user");
const { panel } = require("./utils/panel");
const fs = require("fs");
const PORT = 3002;

app.use(bodyParser.json());
app.use(cors());
app.use("/user", usersRouter);
app.use("/panel", panel);

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/validpanel.com-0002/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/validpanel.com-0002/fullchain.pem"
  ),
};
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server running on https://validpanel.com:${PORT}/`);
});
