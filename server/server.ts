const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');

const keys = require('./keys');

const app = express();
const port = process.env.PORT || 5000;

// config
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/api/hello', (req, res) => {
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
        client_id: keys.github.clientId,
        client_secret: keys.github.clientSecret,
        redirect_uri: keys.github.redirectUri,
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
