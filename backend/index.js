const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/user");
const { panel } = require("./utils/panel");
const cron = require("node-cron");
const fs = require("fs");
const { createSSL } = require("./utils/dns");
const PORT = 3002;

app.use(bodyParser.json());
app.use(cors());
app.use("/user", usersRouter);
app.use("/panel", panel);

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/validpanel.com-0004/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/validpanel.com-0004/fullchain.pem"
  ),
};
const server = https.createServer(options, app);

cron.schedule("* * * * *", () => {
  createSSL();
});

server.listen(PORT, () => {
  console.log(`Server running on https://validpanel.com:${PORT}/`);
});
