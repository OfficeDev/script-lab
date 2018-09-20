if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URL } = process.env;

const app = express();
const port = process.env.PORT || 5000;

// config
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/auth', (req, res) => {
  console.log(req.body);
  const { code, state } = req.body;
  request.post(
    {
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        Accept: 'application/json',
      },
      json: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        redirect_uri: GITHUB_REDIRECT_URL,
        code,
        state,
      },
    },
    (error, httpResponse, body) => {
      if (error) {
        console.error('github login failed');
        res
          .contentType('application/json')
          .status(500)
          .send({ error });
      } else {
        res
          .contentType('application/json')
          .status(200)
          .send(body);
      }
    },
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
