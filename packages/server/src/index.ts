import express from 'express';
import { getAccessTokenOrErrorResponse } from './auth';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const app = express();
const port = process.env.PORT || 5000;

// config
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
    .header('Access-Control-Allow-Headers', 'content-type')
    .header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
    .header('Access-Control-Allow-Origin', '*')
    .header('Content-Length', '0')
    .status(204);
});

// An auth endpoint for GitHub that returns a JSON payload of tyAccess-Control-Allow-Methodspe IServerAuthResponse
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
    .header('Access-Control-Allow-Origin', '*')
    .status(200)
    .send(responsePayload);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/test', (_req, res) => {
  res
    .contentType('text/plain')
    .status(200)
    .send('test response 1');
});
