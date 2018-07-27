const express = require('express');
const request = require('request');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/auth', (req, res) => {
  const { code, state } = req.body;
  request.post(
    {
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        Accept: 'application/json',
      },
      json: {
        client_id: clientId,
        client_secret: getClientSecret(),
        redirect_uri: editorUrl,
        code,
        state,
      },
    },
    (error, httpResponse, body) => {
      if (error) {
        console.error('github login failed');
        res
          .contentType('application/json')
          .status(200)
          .send(body);
      } else {
        res
          .contentType('application/json')
          .status(500)
          .send({ error });
      }
    },
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
