if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const https = require("https");
const fs = require("fs");

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URL
} = process.env;

const app = express();
const port = process.env.PORT || 5000;

// config
app.use(cors());
app.use(bodyParser.json());

// routes
app.get("/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.get("/iframe.html", function(req, res) {
  res.sendFile(path.join(__dirname, "../public", "iframe.html"));
});

app.get("/worker.js", function(req, res) {
  res.sendFile(path.join(__dirname, "../public", "worker.js"));
});

app.get("/iframe.js", function(req, res) {
  res.sendFile(path.join(__dirname, "../public", "iframe.js"));
});

app.post("/auth", (req, res) => {
  const { code, state } = req.body;
  request.post(
    {
      url: "https://github.com/login/oauth/access_token",
      headers: {
        Accept: "application/json"
      },
      json: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        redirect_uri: GITHUB_REDIRECT_URL,
        code,
        state
      }
    },
    (error, httpResponse, body) => {
      if (error) {
        console.error("github login failed");
        res
          .contentType("application/json")
          .status(500)
          .send({ error });
      } else {
        res
          .contentType("application/json")
          .status(200)
          .send(body);
      }
    }
  );
});
const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem")
};

const server = https
  .createServer(httpsOptions, app)
  .listen(port, () => console.log(`Listening on port ${port}`));
