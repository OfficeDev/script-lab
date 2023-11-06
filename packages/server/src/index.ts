import express from 'express';
import { getAccessTokenOrErrorResponse } from './auth';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const app = express();
const port = process.env.PORT || 5000;

// config

// express.json middleware allows handling request JSON payloads
app.use(express.json() as any);

// routes

// Server "hello" endpoint, used to check that the server is alive
//  (and used by environment.redirector.ts for localhost redirect)
app.get('/hello', (_req, res) => {
  res
    .contentType('application/json')
    .status(200)
    .send({ message: 'Hello from Script Lab' });
});

app.options('/auth', async (_req, res) => {
  res
    .set({
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Origin': '*',
    })
    .status(204);
});

// An auth endpoint for GitHub that returns a JSON payload of type IServerAuthResponse
app.post('/auth', async (req, res) => {
  const { code, state } = req.body;

  let responsePayload: IServerAuthResponse;

  try {
    responsePayload = await getAccessTokenOrErrorResponse({
      code,
      state,
    });
  } catch (e) {
    responsePayload = { error: JSON.stringify(e) };
  }

  res
    .contentType('application/json')
    .set({ 'Access-Control-Allow-Origin': '*' })
    .status(200)
    .send(responsePayload);
});

app.get('/test', (_req, res) => {
  res
    .contentType('text/plain')
    .header({ 'Access-Control-Allow-Origin': '*' })
    .status(200)
    .send('test response 1');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
