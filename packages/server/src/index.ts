if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getAccessTokenOrErrorResponse } from './auth';

const app = express();
const port = process.env.PORT || 5000;

// config
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/hello', (_req, res) => {
  res.send({ express: 'Hello From Express' });
});

// An auth endpoint for GitHub that returns a JSON payload of type IServerAuthResponse
app.post('/auth', async (req, res) => {
  const { code, state } = req.body;

  let responsePayload: IServerAuthResponse = await getAccessTokenOrErrorResponse({
    code,
    state,
  });

  res
    .contentType('application/json')
    .status(200)
    .send(responsePayload);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
