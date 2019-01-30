if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { respondWithAccessTokenCommon, encodeToken } from './auth';

const app = express();
const port = process.env.PORT || 5000;

// config
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

// An auth endpoint that returns the `{ access_token: string }` directly in un-encoded form,
//      or `{ error: string }` in case of error
app.post('/auth', (req, res) => {
  const { code, state } = req.body;
  respondWithAccessTokenCommon({
    code,
    state,
    response: res,
  });
});

// An auth endpoint that taken in an additional "key" parameter on the body (corresponding to a
// public key generated on the client), and returns `{ encodedToken: string }` or `{ error: string }`
app.post('/auth/encoded', (req, res) => {
  const { code, state, key } = req.body;

  respondWithAccessTokenCommon({
    code,
    state,
    response: res,
    onSuccessResponseMassager: body => ({
      encodedToken: encodeToken(body.access_token, key),
    }),
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
